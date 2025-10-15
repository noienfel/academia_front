import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    try {
      const res = await fetch('http://localhost:3000/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro || 'Erro ao logar')
        return
      }

      // Salva token e nome no localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('nome', data.nome)

      navigate('/') // redireciona para Dashboard ou Planos
    } catch (error) {
      setErro('Erro de conexão com o servidor')
      console.error(error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {erro && <p className="text-red-600 mb-4">{erro}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
