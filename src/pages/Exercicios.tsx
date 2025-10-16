import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Exercicio = { 
  id: string; 
  nome: string; 
  series: number; 
  repeticoes: number; 
  treinoId: string;
  treino?: { id: string; nome: string; aluno: { nome: string } }
  createdAt: string;
}

type Treino = { id: string; nome: string; aluno: { nome: string } }

export default function Exercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [nome, setNome] = useState('')
  const [series, setSeries] = useState(3)
  const [repeticoes, setRepeticoes] = useState(10)
  const [treinoId, setTreinoId] = useState('')
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroTreino, setFiltroTreino] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  async function loadExercicios() {
    try {
      const resp = await api.get('/exercicios')
      setExercicios(resp.data)
    } catch (err) { 
      console.error(err) 
    }
  }

  async function loadTreinos() {
    try {
      const resp = await api.get('/treinos')
      setTreinos(resp.data)
    } catch (err) { 
      console.error(err) 
    }
  }

  useEffect(()=>{ 
    loadExercicios()
    loadTreinos()
  },[])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    try {
      if (editando) {
        await api.put(`/exercicios/${editando}`, { nome, series, repeticoes, treinoId })
        setEditando(null)
        alert('Exercício atualizado com sucesso!')
      } else {
        await api.post('/exercicios', { nome, series, repeticoes, treinoId })
        alert('Exercício criado com sucesso!')
      }
      setNome(''); setSeries(3); setRepeticoes(10); setTreinoId('')
      setMostrarForm(false)
      loadExercicios()
    } catch (err: any) { 
      setErro(err?.response?.data?.erro || 'Erro ao salvar exercício')
    }
  }

  async function handleDelete(id: string) {
    if(!confirm('Deletar exercício?')) return
    try {
      await api.delete(`/exercicios/${id}`)
      loadExercicios()
      alert('Exercício deletado com sucesso!')
    } catch (err) { 
      console.error(err) 
    }
  }

  function handleEdit(exercicio: Exercicio) {
    setNome(exercicio.nome)
    setSeries(exercicio.series)
    setRepeticoes(exercicio.repeticoes)
    setTreinoId(exercicio.treinoId)
    setEditando(exercicio.id)
    setMostrarForm(true)
  }

  function cancelEdit() {
    setNome(''); setSeries(3); setRepeticoes(10); setTreinoId('')
    setEditando(null)
    setMostrarForm(false)
  }

  const exerciciosFiltrados = exercicios.filter(ex => {
    const matchBusca = ex.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      ex.treino?.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      ex.treino?.aluno?.nome?.toLowerCase().includes(busca.toLowerCase())
    
    const matchTreino = !filtroTreino || ex.treinoId === filtroTreino
    
    return matchBusca && matchTreino
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">💪 Gerenciamento de Exercícios</h1>
            <p className="text-gray-600 dark:text-gray-300">Crie e gerencie exercícios para os treinos dos alunos</p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {mostrarForm ? '❌ Cancelar' : '➕ Novo Exercício'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Exercícios</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{exercicios.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏋️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Treinos com Exercícios</p>
                <p className="text-3xl font-bold text-gray-900">{new Set(exercicios.map(e => e.treinoId)).size}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🔢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Média Séries</p>
                <p className="text-3xl font-bold text-gray-900">
                  {exercicios.length > 0 ? Math.round(exercicios.reduce((acc, e) => acc + e.series, 0) / exercicios.length) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔁</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Média Repetições</p>
                <p className="text-3xl font-bold text-gray-900">
                  {exercicios.length > 0 ? Math.round(exercicios.reduce((acc, e) => acc + e.repeticoes, 0) / exercicios.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {mostrarForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editando ? '✏️ Editar Exercício' : '✨ Criar Novo Exercício'}
            </h2>
            {erro && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 border border-red-200">{erro}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Exercício</label>
                  <input 
                    value={nome} 
                    onChange={e=>setNome(e.target.value)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" 
                    placeholder="Ex: Supino Reto com Barra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treino</label>
                  <select 
                    value={treinoId} 
                    onChange={e=>setTreinoId(e.target.value)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    required
                  >
                    <option value="">Selecione um treino</option>
                    {treinos.map(treino => (
                      <option key={treino.id} value={treino.id}>
                        {treino.nome} - {treino.aluno?.nome || 'Aluno não definido'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Séries</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={series} 
                    onChange={e=>setSeries(Number(e.target.value))} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repetições</label>
                  <input 
                    type="number" 
                    min="1"
                    max="50"
                    value={repeticoes} 
                    onChange={e=>setRepeticoes(Number(e.target.value))} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" 
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {editando ? '✅ Atualizar' : '✅ Criar Exercício'}
                </button>
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Busca e Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Buscar por exercício, treino ou aluno..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />
            </div>
            <div className="md:w-64">
              <select
                value={filtroTreino}
                onChange={(e) => setFiltroTreino(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Todos os treinos</option>
                {treinos.map(treino => (
                  <option key={treino.id} value={treino.id}>
                    {treino.nome} - {treino.aluno?.nome || 'Aluno não definido'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Exercícios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciciosFiltrados.map(ex=>(
            <div key={ex.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{ex.nome}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                          🏋️ {ex.series} séries
                        </span>
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                          🔁 {ex.repeticoes} reps
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p><strong>Treino:</strong> {ex.treino?.nome || 'N/A'}</p>
                        <p><strong>Aluno:</strong> {ex.treino?.aluno?.nome || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleEdit(ex)}
                    className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium hover:bg-blue-200 transition-all duration-300"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(ex.id)}
                    className="flex-1 bg-red-100 text-red-800 px-3 py-2 rounded-lg font-medium hover:bg-red-200 transition-all duration-300"
                  >
                    🗑️ Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {exerciciosFiltrados.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {busca || filtroTreino ? 'Nenhum exercício encontrado' : 'Nenhum exercício cadastrado'}
            </h3>
            <p className="text-gray-600">
              {busca || filtroTreino ? 'Tente ajustar os filtros de busca' : 'Clique em "Novo Exercício" para começar'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}