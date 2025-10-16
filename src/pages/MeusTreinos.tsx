import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Treino = { 
  id: string; 
  nome: string; 
  descricao?: string; 
  exercicios?: { id: string; nome: string; series: number; repeticoes: number }[];
  destaque: boolean;
  admin?: { nome: string };
  createdAt: string;
}

export default function MeusTreinos() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [treinosDestaque, setTreinosDestaque] = useState<Treino[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'destaque' | 'recentes'>('todos')
  const [treinoExpandido, setTreinoExpandido] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [matriculado, setMatriculado] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    async function loadTreinos() {
      try {
        // Verifica se o aluno está matriculado
        const alunoResp = await api.get('/alunos')
        const meusDados = alunoResp.data.find((aluno: any) => aluno.id === userId)
        setMatriculado(meusDados?.matriculado || false)

        const resp = await api.get('/treinos')
        const meusTreinos = resp.data.filter((treino: any) => treino.aluno?.id === userId)
        setTreinos(meusTreinos || [])

        try {
          const respDestaque = await api.get('/treinos/destaques')
          setTreinosDestaque(respDestaque.data || [])
        } catch {
          setTreinosDestaque([])
        }
      } catch (err) {
        console.error(err)
        setTreinos([])
        setTreinosDestaque([])
      } finally {
        setLoading(false)
      }
    }
    
    if (userId) {
      loadTreinos()
    } else {
      setLoading(false)
    }
  }, [userId])

  async function toggleDestaque(treinoId: string) {
    try {
      await api.patch(`/treinos/destacar/${treinoId}`)
      const resp = await api.get('/treinos')
      const meusTreinos = resp.data.filter((treino: any) => treino.aluno?.id === userId)
      setTreinos(meusTreinos || [])
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar destaque')
    }
  }

  const treinosFiltrados = treinos.filter(treino => {
    const matchBusca = treino.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      treino.descricao?.toLowerCase().includes(busca.toLowerCase())
    
    if (!matchBusca) return false
    
    if (filtro === 'destaque') return treino.destaque
    if (filtro === 'recentes') {
      const umaSemanaAtras = new Date()
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7)
      return new Date(treino.createdAt) > umaSemanaAtras
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!matriculado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="text-8xl mb-6">🏋️‍♂️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Assine agora mesmo os planos para começar a treinar!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Para acessar seus treinos personalizados, você precisa estar matriculado em um de nossos planos.
          </p>
          <div className="space-y-4">
            <a 
              href="/planos" 
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🎯 Ver Planos Disponíveis
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Escolha o plano ideal para você e comece a treinar hoje mesmo!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💪 Meus Treinos</h1>
          <p className="text-gray-600">Gerencie seus treinos e acompanhe seu progresso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏋️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Treinos</p>
                <p className="text-3xl font-bold text-gray-900">{treinos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Em Destaque</p>
                <p className="text-3xl font-bold text-gray-900">{treinos.filter(t => t.destaque).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Exercícios</p>
                <p className="text-3xl font-bold text-gray-900">
                  {treinos.reduce((acc, t) => acc + (t.exercicios?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-3xl font-bold text-gray-900">
                  {treinos.filter(t => {
                    const umaSemanaAtras = new Date()
                    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7)
                    return new Date(t.createdAt) > umaSemanaAtras
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Treinos em Destaque da Comunidade */}
        {treinosDestaque && treinosDestaque.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Treinos Populares da Comunidade</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {treinosDestaque.slice(0, 6).map(treino => (
                <div key={treino.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{treino.nome}</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2 animate-pulse">
                      ⭐ Popular
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Por: {treino.admin?.nome || 'Instrutor'}</p>
                  <p className="text-xs text-gray-500">{treino.exercicios?.length || 0} exercícios</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Buscar treinos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtro === 'todos' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos ({treinos.length})
              </button>
              <button
                onClick={() => setFiltro('destaque')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtro === 'destaque' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Destaques ({treinos.filter(t => t.destaque).length})
              </button>
              <button
                onClick={() => setFiltro('recentes')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtro === 'recentes' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Recentes
              </button>
            </div>
          </div>
        </div>

        {/* Meus Treinos */}
        {!treinosFiltrados || treinosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏃♂️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {busca ? 'Nenhum treino encontrado' :
               filtro === 'todos' ? 'Nenhum treino ainda' : 
               filtro === 'destaque' ? 'Nenhum treino em destaque' : 
               'Nenhum treino recente'}
            </h3>
            <p className="text-gray-600 mb-6">
              {busca ? 'Tente buscar por outro termo' : 'Entre em contato com seu instrutor para criar treinos personalizados.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {treinosFiltrados.map(treino => (
              <div key={treino.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{treino.nome}</h3>
                        {treino.destaque && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                            ⭐ Destaque
                          </span>
                        )}
                      </div>
                      {treino.descricao && (
                        <p className="text-gray-600 mb-3">{treino.descricao}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>👨🏫</span> {treino.admin?.nome || 'Instrutor'}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span> {new Date(treino.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💪</span> {treino.exercicios?.length || 0} exercícios
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleDestaque(treino.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          treino.destaque 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:shadow-md'
                        }`}
                      >
                        {treino.destaque ? '⭐ Destacado' : '☆ Destacar'}
                      </button>
                      <button
                        onClick={() => setTreinoExpandido(treinoExpandido === treino.id ? null : treino.id)}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium hover:bg-blue-200 transition-all duration-300"
                      >
                        {treinoExpandido === treino.id ? '👆 Recolher' : '👇 Ver Exercícios'}
                      </button>
                    </div>
                  </div>
                  
                  {treinoExpandido === treino.id && treino.exercicios && treino.exercicios.length > 0 && (
                    <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">📋 Lista de Exercícios:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {treino.exercicios.map((exercicio, index) => (
                          <div key={exercicio.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="font-medium text-gray-900">{exercicio.nome}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                                  {exercicio.series} séries
                                </span>
                                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                                  {exercicio.repeticoes} reps
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}