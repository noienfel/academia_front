import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

type Stats = {
  alunos: number
  treinos: number
  matriculados: number
  naomatriculados: number
  totalInstrutores: number
  exercicios: number
  pagamentos: number
  receita: number
}

type Aluno = {
  id: string
  nome: string
  saldo: number
  matriculado: boolean
}

type Pagamento = {
  id: string
  valor: number
  metodo: string
  status: string
  createdAt: string
  aluno: { nome: string }
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    alunos: 0, treinos: 0, matriculados: 0, naomatriculados: 0, 
    totalInstrutores: 0, exercicios: 0, pagamentos: 0, receita: 0
  })
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [statsResp, alunosResp, pagamentosResp, exerciciosResp] = await Promise.all([
          api.get('/dashboard/gerais'),
          api.get('/alunos'),
          api.get('/pagamentos'),
          api.get('/exercicios')
        ])
        
        const statsData = statsResp.data
        const alunosData = alunosResp.data
        const pagamentosData = pagamentosResp.data
        const exerciciosData = exerciciosResp.data
        
        const receita = pagamentosData
          .filter((p: Pagamento) => p.status === 'PAGO')
          .reduce((acc: number, p: Pagamento) => acc + p.valor, 0)
        
        setStats({
          ...statsData,
          exercicios: exerciciosData.length,
          pagamentos: pagamentosData.length,
          receita
        })
        setAlunos(alunosData)
        setPagamentos(pagamentosData.slice(0, 5))
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const ChartDonut = ({ data, title, centerText }: { data: { label: string, value: number, color: string }[], title: string, centerText: string }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0)
    
    if (total === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
          <div className="text-center py-8 text-gray-500">Sem dados para exibir</div>
        </div>
      )
    }
    
    let currentAngle = 0
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">{title}</h3>
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.filter(item => item.value > 0).map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              
              if (angle === 0) return null
              
              const x1 = 50 + 35 * Math.cos((currentAngle * Math.PI) / 180)
              const y1 = 50 + 35 * Math.sin((currentAngle * Math.PI) / 180)
              const x2 = 50 + 35 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
              const y2 = 50 + 35 * Math.sin(((currentAngle + angle) * Math.PI) / 180)
              const largeArc = angle > 180 ? 1 : 0
              
              const path = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`
              currentAngle += angle
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity"
                />
              )
            })}
            <circle cx="50" cy="50" r="20" className="fill-white dark:fill-gray-800" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">{centerText}</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{total}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const matriculadosData = [
    { label: 'Matriculados', value: stats.matriculados, color: '#10B981' },
    { label: 'Não Matriculados', value: stats.naomatriculados, color: '#EF4444' }
  ]

  const pagamentosData = [
    { label: 'PIX', value: pagamentos.filter(p => p.metodo === 'PIX').length, color: '#3B82F6' },
    { label: 'Cartão', value: pagamentos.filter(p => p.metodo === 'CARTAO').length, color: '#8B5CF6' },
    { label: 'Dinheiro', value: pagamentos.filter(p => p.metodo === 'DINHEIRO').length, color: '#F59E0B' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📊 Visão Geral do Sistema</h1>
          <p className="text-gray-600 dark:text-gray-300">Dashboard administrativo com estatísticas e métricas da academia</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/alunos" className="group">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Alunos</p>
                  <p className="text-3xl font-bold">{stats.alunos}</p>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>
          </Link>

          <Link to="/treinos" className="group">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Treinos Ativos</p>
                  <p className="text-3xl font-bold">{stats.treinos}</p>
                </div>
                <div className="text-4xl opacity-80">🏋️</div>
              </div>
            </div>
          </Link>

          <Link to="/exercicios" className="group">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Exercícios</p>
                  <p className="text-3xl font-bold">{stats.exercicios}</p>
                </div>
                <div className="text-4xl opacity-80">💪</div>
              </div>
            </div>
          </Link>

          <Link to="/planos" className="group">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold">R$ {stats.receita.toFixed(0)}</p>
                </div>
                <div className="text-4xl opacity-80">💰</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ChartDonut 
            data={matriculadosData}
            title="Status dos Alunos"
            centerText="Alunos"
          />
          <ChartDonut 
            data={pagamentosData}
            title="Métodos de Pagamento"
            centerText="Pagamentos"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Alunos por Saldo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">💳 Maiores Saldos</h3>
            <div className="space-y-3">
              {alunos
                .sort((a, b) => b.saldo - a.saldo)
                .slice(0, 5)
                .map((aluno, index) => (
                <div key={aluno.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{aluno.nome}</p>
                      <p className="text-sm text-gray-500">
                        {aluno.matriculado ? '✅ Matriculado' : '❌ Não Matriculado'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {Number(aluno.saldo).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagamentos Recentes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">💸 Pagamentos Recentes</h3>
            <div className="space-y-3">
              {pagamentos.map((pagamento) => (
                <div key={pagamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      pagamento.status === 'PAGO' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{pagamento.aluno.nome}</p>
                      <p className="text-sm text-gray-500">{pagamento.metodo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {Number(pagamento.valor).toFixed(2)}</p>
                    <p className={`text-xs ${
                      pagamento.status === 'PAGO' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {pagamento.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}