import React from 'react'
import { Link } from 'react-router-dom'

const planos = [
  {
    id: 1,
    nome: "Plano Básico",
    preco: 79.90,
    beneficios: [
      "Acesso à musculação",
      "Treino personalizado",
      "Acompanhamento mensal"
    ]
  },
  {
    id: 2,
    nome: "Plano Premium",
    preco: 129.90,
    beneficios: [
      "Acesso à musculação",
      "Treino personalizado",
      "Acompanhamento semanal",
      "Acesso às aulas coletivas",
      "Avaliação física"
    ]
  },
  {
    id: 3,
    nome: "Plano VIP",
    preco: 199.90,
    beneficios: [
      "Acesso completo",
      "Personal trainer",
      "Acompanhamento diário",
      "Todas as aulas",
      "Avaliação física completa",
      "Suplementação básica"
    ]
  }
]

export default function PlanosPublicos() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Academia System</h1>
          <Link 
            to="/login" 
            className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
          >
            Fazer Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Transforme seu Corpo</h1>
          <p className="text-xl mb-8">Escolha o plano ideal para seus objetivos</p>
        </div>
      </div>

      {/* Planos */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Planos</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {planos.map(plano => (
            <div key={plano.id} className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{plano.nome}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                R$ {plano.preco.toFixed(2)}
                <span className="text-lg text-gray-500">/mês</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plano.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {beneficio}
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/cadastro" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
              >
                Cadastrar e Assinar
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Já tem uma conta? Faça login para gerenciar sua assinatura
          </p>
          <div className="space-x-4">
            <Link 
              to="/cadastro" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Criar Conta
            </Link>
            <Link 
              to="/login" 
              className="text-blue-600 font-semibold hover:underline"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}