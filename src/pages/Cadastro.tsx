import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  // Apenas cadastro de alunos
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      await api.post('/alunos', { nome, email, senha })
      alert('Cadastro realizado com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (err: any) {
      const errorMsg = err?.response?.data?.erro || err?.response?.data?.message || err?.message || 'Erro ao criar conta'
      setErro(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Criar Conta</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Cadastre-se para acessar a academia</p>
        </div>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {typeof erro === 'string' ? erro : 'Erro no cadastro'}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: João Silva Santos"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sua senha segura"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              <p>A senha deve conter:</p>
              <ul className="list-disc list-inside">
                <li>Mínimo 8 caracteres</li>
                <li>1 letra maiúscula</li>
                <li>1 letra minúscula</li>
                <li>1 número</li>
                <li>1 símbolo (@, #, $, etc.)</li>
              </ul>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Fazer login
            </Link>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Área administrativa?{' '}
            <Link to="/admin-login" className="text-green-600 font-semibold hover:underline">
              Login Admin
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link 
            to="/planos-publicos" 
            className="text-gray-500 text-sm hover:underline"
          >
            ← Voltar para os planos
          </Link>
        </div>
      </div>
    </div>
  )
}