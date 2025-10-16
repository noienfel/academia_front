import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Treino = { 
  id: string; 
  nome: string; 
  descricao?: string; 
  aluno: { id: string; nome: string; email: string }; 
  admin?: { id: string; nome: string; email: string }; 
  exercicios: any[];
  destaque: boolean;
  ativo: boolean;
  createdAt: string;
}

type Aluno = { id: string; nome: string; email: string }
type Admin = { id: string; nome: string; email: string }

export default function Treinos() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [alunoId, setAlunoId] = useState('')
  const [adminId, setAdminId] = useState('')
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'inativos'>('ativos')
  const [mostrarForm, setMostrarForm] = useState(false)

  async function loadTreinos() {
    try {
      const resp = await api.get('/treinos')
      setTreinos(resp.data)
    } catch (err) { 
      console.error(err) 
    }
  }

  async function loadAlunos() {
    try {
      const resp = await api.get('/alunos')
      setAlunos(resp.data)
    } catch (err) { 
      console.error(err) 
    }
  }

  async function loadAdmins() {
    try {
      const resp = await api.get('/admins')
      setAdmins(resp.data)
    } catch (err) { 
      console.error(err) 
    }
  }

  useEffect(()=>{ 
    loadTreinos()
    loadAlunos()
    loadAdmins()
  },[])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    try {
      await api.post('/treinos', { nome, descricao, alunoId, adminId })
      setNome(''); setDescricao(''); setAlunoId(''); setAdminId('')
      setMostrarForm(false)
      loadTreinos()
      alert('Treino criado com sucesso!')
    } catch (err: any) { 
      setErro(err?.response?.data?.erro || 'Erro ao criar treino')
    }
  }

  async function toggleDestaque(id: string) {
    try {
      await api.patch(`/treinos/destacar/${id}`)
      loadTreinos()
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteTreino(id: string) {
    if (!confirm('Deseja excluir este treino?')) return
    try {
      await api.delete(`/treinos/${id}`)
      loadTreinos()
      alert('Treino excluído com sucesso!')
    } catch (err) {
      console.error(err)
    }
  }

  const treinosFiltrados = treinos.filter(treino => {
    const matchBusca = treino.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      treino.aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      treino.admin?.nome.toLowerCase().includes(busca.toLowerCase())
    
    if (!matchBusca) return false
    
    if (filtroStatus === 'ativos') return treino.ativo
    if (filtroStatus === 'inativos') return !treino.ativo
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🏋️ Gerenciamento de Treinos</h1>
            <p className="text-gray-600 dark:text-gray-300">Crie e gerencie treinos personalizados para seus alunos</p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {mostrarForm ? '❌ Cancelar' : '➕ Novo Treino'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Treinos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{treinos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Treinos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{treinos.filter(t => t.ativo).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Alunos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{new Set(treinos.filter(t => t.ativo).map(t => t.aluno.id)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Criação */}
        {mostrarForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">✨ Criar Novo Treino</h2>
            {erro && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 border border-red-200">{erro}</div>}
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Treino</label>
                  <input 
                    value={nome} 
                    onChange={e=>setNome(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" 
                    placeholder="Ex: Treino de Peito e Tríceps"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aluno</label>
                  <select 
                    value={alunoId} 
                    onChange={e=>setAlunoId(e.target.value)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  >
                    <option value="">Selecione um aluno</option>
                    {alunos.map(aluno => (
                      <option key={aluno.id} value={aluno.id}>{aluno.nome} - {aluno.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instrutor Responsável</label>
                  <select 
                    value={adminId} 
                    onChange={e=>setAdminId(e.target.value)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  >
                    <option value="">Selecione um instrutor</option>
                    {admins.map(admin => (
                      <option key={admin.id} value={admin.id}>{admin.nome} - {admin.email}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (Opcional)</label>
                  <textarea 
                    value={descricao} 
                    onChange={e=>setDescricao(e.target.value)} 
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    rows={3}
                    placeholder="Descreva o objetivo e foco do treino..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ✅ Criar Treino
                </button>
                <button 
                  type="button"
                  onClick={() => setMostrarForm(false)}
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
                placeholder="🔍 Buscar por treino, aluno ou instrutor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroStatus('todos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtroStatus === 'todos' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos ({treinos.length})
              </button>
              <button
                onClick={() => setFiltroStatus('ativos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtroStatus === 'ativos' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ativos ({treinos.filter(t => t.ativo).length})
              </button>
              <button
                onClick={() => setFiltroStatus('inativos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  filtroStatus === 'inativos' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inativos ({treinos.filter(t => !t.ativo).length})
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Treinos */}
        <div className="grid gap-6">
          {treinosFiltrados.map(treino=>(
            <div key={treino.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{treino.nome}</h3>
                      {treino.destaque && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                          ⭐ Destaque
                        </span>
                      )}
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        treino.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {treino.ativo ? '✅ Ativo' : '❌ Inativo'}
                      </span>
                    </div>
                    {treino.descricao && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{treino.descricao}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>👤</span> {treino.aluno.nome}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👨🏫</span> {treino.admin?.nome || 'Não definido'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💪</span> {treino.exercicios.length} exercícios
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span> {new Date(treino.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
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
                      onClick={() => deleteTreino(treino.id)}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-all duration-300"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {treinosFiltrados.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {busca ? 'Nenhum treino encontrado' : 'Nenhum treino cadastrado'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {busca ? 'Tente buscar por outro termo' : 'Clique em "Novo Treino" para começar'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}