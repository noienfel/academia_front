import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Aluno = { id: number; nome: string; email: string }

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
    try {
      await api.post('/alunos', { nome, email, senha })
      setNome(''); setEmail(''); setSenha('')
      load()
    } catch (err: any) {
      setErro(err?.response?.data?.erro || 'Erro')
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">Gerenciamento de Alunos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-2">Novo Aluno</h2>
            {erro && <div className="bg-red-100 text-red-700 p-3 rounded">{String(erro)}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input value={nome} onChange={e=>setNome(e.target.value)} className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Criar Aluno</button>
          </form>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Lista de Alunos</h2>
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b-2 border-gray-200"><th className="pb-2">ID</th><th className="pb-2">Nome</th><th className="pb-2">Email</th></tr>
              </thead>
              <tbody>
                {alunos.map(i=>(
                  <tr key={i.id} className="border-b border-gray-100"><td className="py-2">{i.id}</td><td className="py-2">{i.nome}</td><td className="py-2">{i.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}