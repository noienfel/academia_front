import React, { useEffect, useState } from 'react'
import api from '../services/api'

const planosDisponiveis = [
  { id: 1, nome: "Plano Básico", preco: 79.90 },
  { id: 2, nome: "Plano Premium", preco: 129.90 },
  { id: 3, nome: "Plano VIP", preco: 199.90 }
]

type Aluno = { 
  id: string; 
  nome: string; 
  email: string; 
  matriculado: boolean; 
  saldo: number 
}

export default function Planos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [alunoId, setAlunoId] = useState('')
  const [valor, setValor] = useState('')
  const [valorDeposito, setValorDeposito] = useState('')
  const [metodo, setMetodo] = useState<'CARTAO' | 'PIX' | 'DINHEIRO'>('PIX')
  const [metodoDeposito, setMetodoDeposito] = useState<'CARTAO' | 'PIX' | 'DINHEIRO'>('PIX')
  const tipoUsuario = localStorage.getItem('tipoUsuario')
  const userId = localStorage.getItem('userId')
  const [meuSaldo, setMeuSaldo] = useState(0)

  async function loadAlunos() {
    try {
      const resp = await api.get('/alunos')
      setAlunos(resp.data)
      
      if (tipoUsuario === 'aluno') {
        const meusDados = resp.data.find((aluno: any) => aluno.id === userId)
        if (meusDados) {
          setMeuSaldo(Number(meusDados.saldo))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAlunos()
  }, [])

  async function assinarPlano(plano: any) {
    if (meuSaldo < plano.preco) {
      alert(`Saldo insuficiente! Você precisa de R$ ${(plano.preco - meuSaldo).toFixed(2)} a mais.`)
      return
    }

    try {
      await api.post('/pagamentos', {
        alunoId: userId,
        valor: plano.preco,
        metodo: 'PIX',
        status: 'PAGO'
      })
      loadAlunos()
      alert(`Plano ${plano.nome} assinado com sucesso!`)
    } catch (err) {
      console.error(err)
      alert('Erro ao assinar plano')
    }
  }

  async function handleDeposito(e: React.FormEvent) {
    e.preventDefault()
    const targetAlunoId = tipoUsuario === 'aluno' ? userId : alunoId
    const valorFinal = tipoUsuario === 'aluno' ? valorDeposito : valor
    const metodoFinal = tipoUsuario === 'aluno' ? metodoDeposito : metodo
    
    try {
      await api.post('/depositos', {
        alunoId: targetAlunoId,
        valor: parseFloat(valorFinal),
        metodo: metodoFinal
      })
      setAlunoId(''); setValor(''); setValorDeposito('')
      loadAlunos()
      alert('Depósito realizado com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro ao realizar depósito')
    }
  }

  if (tipoUsuario === 'aluno') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">🎯 Planos da Academia</h1>
        
        {/* Saldo */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Meu Saldo</h2>
              <div className="text-4xl font-bold">R$ {meuSaldo.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                meuSaldo > 0 ? 'bg-green-400' : 'bg-red-500'
              }`}>
                {meuSaldo > 0 ? '✓ Ativo' : '⚠ Sem créditos'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Adicionar Créditos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">💰 Adicionar Créditos</h2>
            <form onSubmit={handleDeposito} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="1"
                  value={valorDeposito} 
                  onChange={e=>setValorDeposito(e.target.value)} 
                  className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: 100.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método</label>
                <select 
                  value={metodoDeposito} 
                  onChange={e=>setMetodoDeposito(e.target.value as any)} 
                  className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PIX">PIX</option>
                  <option value="CARTAO">Cartão</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </select>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                Adicionar Créditos
              </button>
            </form>
          </div>

          {/* Resumo da Conta */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">📊 Resumo da Conta</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-600 dark:text-gray-300">Saldo Atual</span>
                <span className="font-bold text-2xl text-green-600">R$ {meuSaldo.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ℹ️ Use seu saldo para assinar planos mensais
              </div>
            </div>
          </div>
        </div>

        {/* Planos Disponíveis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">🎆 Planos Disponíveis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {planosDisponiveis.map(plano => (
              <div key={plano.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border-2 transition-all hover:shadow-lg ${
                plano.id === 2 ? 'border-blue-500 transform scale-105' : 'border-gray-200 dark:border-gray-700'
              }`}>
                {plano.id === 2 && (
                  <div className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full mb-4 inline-block">
                    🔥 Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{plano.nome}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  R$ {plano.preco.toFixed(2)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/mês</span>
                </div>
                
                <div className="text-left mb-6 space-y-2">
                  {plano.id === 1 && (
                    <>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Acesso à musculação
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Treino personalizado
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Acompanhamento mensal
                      </div>
                    </>
                  )}
                  {plano.id === 2 && (
                    <>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Tudo do Básico
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Aulas coletivas
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Acompanhamento semanal
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Avaliação física
                      </div>
                    </>
                  )}
                  {plano.id === 3 && (
                    <>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Tudo do Premium
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Personal trainer
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Acompanhamento diário
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        Suplementação básica
                      </div>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={() => assinarPlano(plano)}
                  disabled={meuSaldo < plano.preco}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    meuSaldo >= plano.preco 
                      ? plano.id === 2 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {meuSaldo >= plano.preco ? 'Assinar Agora' : `Faltam R$ ${(plano.preco - meuSaldo).toFixed(2)}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Visão do Admin
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6 font-bold text-gray-900 dark:text-white">Gestão Financeira</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">💰 Adicionar Créditos</h2>
        <form onSubmit={handleDeposito} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
            <select 
              value={alunoId} 
              onChange={e=>setAlunoId(e.target.value)} 
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Selecione um aluno</option>
              {alunos.map(aluno => (
                <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={valor} 
                onChange={e=>setValor(e.target.value)} 
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método</label>
              <select 
                value={metodo} 
                onChange={e=>setMetodo(e.target.value as any)} 
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg"
              >
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>
          </div>
          <button className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700">
            Adicionar Créditos
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">💳 Saldos dos Alunos</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {alunos.map(aluno => (
            <div key={aluno.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-700">
              <div className="font-medium text-gray-900 dark:text-white">{aluno.nome}</div>
              <div className={`text-xs mb-2 ${aluno.matriculado ? 'text-green-600' : 'text-red-600'}`}>
                {aluno.matriculado ? '✓ Matriculado' : '⚠ Não Matriculado'}
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">R$ {Number(aluno.saldo).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}