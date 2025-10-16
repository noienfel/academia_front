import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Aluno = { id: string; nome: string; email: string; matriculado: boolean; saldo: number }

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function load() {
    try {
      const resp = await api.get('/alunos')
      setAlunos(resp.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(()=>{ load() },[])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    
    if (!nome || !email || !senha) {
      setErro('Todos os campos são obrigatórios')
      return
    }
    
    try {
      await api.post('/alunos', { nome, email, senha })
      setNome(''); setEmail(''); setSenha('')
      load()
      alert('Aluno criado com sucesso!')
    } catch (err: any) {
      setErro(err?.response?.data?.erro || err?.response?.data?.message || 'Erro ao criar aluno')
      console.error('Erro detalhado:', err.response?.data)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-gray-900 dark:text-white">Gerenciamento de Alunos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Novo Aluno</h2>
            {erro && <div className="bg-red-100 text-red-700 p-3 rounded">{String(erro)}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
              <input 
                type="text"
                value={nome} 
                onChange={e=>setNome(e.target.value)} 
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Nome completo do aluno"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" 
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <input 
                type="password" 
                value={senha} 
                onChange={e=>setSenha(e.target.value)} 
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Senha forte"
                required
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Criar Aluno</button>
          </form>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lista de Alunos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="pb-2 text-gray-900 dark:text-white">Nome</th>
                    <th className="pb-2 text-gray-900 dark:text-white">Email</th>
                    <th className="pb-2 text-gray-900 dark:text-white">Status</th>
                    <th className="pb-2 text-gray-900 dark:text-white">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(i=>(
                    <tr key={i.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 text-gray-900 dark:text-white">{i.nome}</td>
                      <td className="py-2 text-gray-900 dark:text-white">{i.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${i.matriculado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {i.matriculado ? 'Matriculado' : 'Não Matriculado'}
                        </span>
                      </td>
                      <td className="py-2 text-gray-900 dark:text-white">R$ {Number(i.saldo).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}