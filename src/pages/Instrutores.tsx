import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Instrutor = { 
  id: string; 
  nome: string; 
  email: string; 
  nivel: number;
  createdAt: string;
}

export default function Instrutores() {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  async function loadInstrutores() {
    try {
      const resp = await api.get('/admins')
      // Filtra apenas instrutores (nível 2)
      const somenteInstrutores = resp.data.filter((admin: any) => admin.nivel === 2)
      setInstrutores(somenteInstrutores)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { 
    loadInstrutores() 
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    try {
      await api.post('/admins', { 
        nome, 
        email, 
        senha, 
        nivel: 2 // Sempre nível 2 para instrutor
      })
      setNome(''); setEmail(''); setSenha('')
      loadInstrutores()
    } catch (err: any) {
      setErro(err?.response?.data?.erro || 'Erro ao criar instrutor')
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">Gerenciamento de Instrutores</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-2">Novo Instrutor</h2>
            {erro && <div className="bg-red-100 text-red-700 p-3 rounded">{String(erro)}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input 
                value={nome} 
                onChange={e=>setNome(e.target.value)} 
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                value={senha} 
                onChange={e=>setSenha(e.target.value)} 
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mín. 8 chars, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
              </p>
            </div>
            <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Criar Instrutor
            </button>
          </form>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Lista de Instrutores</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-2">Nome</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Cadastrado</th>
                  </tr>
                </thead>
                <tbody>
                  {instrutores.map(instrutor=>(
                    <tr key={instrutor.id} className="border-b border-gray-100">
                      <td className="py-2">{instrutor.nome}</td>
                      <td className="py-2">{instrutor.email}</td>
                      <td className="py-2">
                        {new Date(instrutor.createdAt).toLocaleDateString('pt-BR')}
                      </td>
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