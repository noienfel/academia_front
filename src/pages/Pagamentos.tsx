import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Pagamento = {
  id: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  metodo: 'CARTAO' | 'PIX' | 'DINHEIRO';
  data: string;
}

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [saldo, setSaldo] = useState(0)
  const [valorDeposito, setValorDeposito] = useState('')
  const [metodoDeposito, setMetodoDeposito] = useState<'CARTAO' | 'PIX' | 'DINHEIRO'>('PIX')
  const userId = localStorage.getItem('userId')

  async function loadDados() {
    try {
      // Carrega pagamentos do aluno
      const respPag = await api.get('/pagamentos')
      const meusPagamentos = respPag.data.filter((pag: any) => pag.aluno.id === userId)
      setPagamentos(meusPagamentos)

      // Carrega saldo do aluno
      const respAlunos = await api.get('/alunos')
      const meusDados = respAlunos.data.find((aluno: any) => aluno.id === userId)
      if (meusDados) {
        setSaldo(Number(meusDados.saldo))
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (userId) {
      loadDados()
    }
  }, [userId])

  async function pagarPagamento(pagamentoId: string, metodo: string) {
    try {
      await api.put(`/pagamentos/${pagamentoId}/pagar`, { metodo })
      loadDados()
      alert('Pagamento realizado com sucesso!')
    } catch (err: any) {
      const erro = err?.response?.data?.erro || 'Erro ao processar pagamento'
      alert(erro)
    }
  }

  async function handleDeposito(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/depositos', {
        alunoId: userId,
        valor: parseFloat(valorDeposito),
        metodo: metodoDeposito
      })
      setValorDeposito('')
      loadDados()
      alert('Depósito realizado com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro ao realizar depósito')
    }
  }

  const pagamentosPendentes = pagamentos.filter(p => p.status === 'PENDENTE')
  const pagamentosRealizados = pagamentos.filter(p => p.status !== 'PENDENTE')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meus Pagamentos</h1>
      
      {/* Saldo */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Meu Saldo</h2>
            <div className="text-4xl font-bold">R$ {saldo.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              saldo > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {saldo > 0 ? '✓ Ativo' : '⚠ Sem créditos'}
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar Créditos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-green-600">💰 Adicionar Créditos</h2>
        <form onSubmit={handleDeposito} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
            <input 
              type="number" 
              step="0.01"
              min="1"
              value={valorDeposito} 
              onChange={e=>setValorDeposito(e.target.value)} 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg"
              placeholder="Ex: 100.00"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
            <select 
              value={metodoDeposito} 
              onChange={e=>setMetodoDeposito(e.target.value as any)} 
              className="w-full border border-gray-300 px-4 py-3 rounded-lg"
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão de Crédito</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Adicionar
          </button>
        </form>
      </div>

      {/* Cobranças Pendentes */}
      {pagamentosPendentes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-800">🔴 Cobranças Pendentes</h2>
          <p className="text-red-700 mb-4">Você tem cobranças pendentes. Pague para manter sua matrícula ativa!</p>
          <div className="space-y-3">
            {pagamentosPendentes.map(pag => (
              <div key={pag.id} className="bg-white rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">R$ {pag.valor.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    Vencimento: {new Date(pag.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2">
                  {saldo >= pag.valor ? (
                    <select 
                      onChange={(e) => pagarPagamento(pag.id, e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded bg-green-50"
                      defaultValue=""
                    >
                      <option value="" disabled>Pagar com...</option>
                      <option value="PIX">PIX</option>
                      <option value="CARTAO">Cartão</option>
                      <option value="DINHEIRO">Dinheiro</option>
                    </select>
                  ) : (
                    <div className="text-red-600 text-sm">
                      Saldo insuficiente<br/>
                      <span className="text-xs">Adicione R$ {(pag.valor - saldo).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Histórico de Pagamentos</h2>
        {pagamentosRealizados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum pagamento realizado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left pb-3">Data</th>
                  <th className="text-left pb-3">Valor</th>
                  <th className="text-left pb-3">Método</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagamentosRealizados.map(pag => (
                  <tr key={pag.id} className="border-b border-gray-100">
                    <td className="py-3">{new Date(pag.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 font-semibold">R$ {pag.valor.toFixed(2)}</td>
                    <td className="py-3">{pag.metodo}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pag.status === 'PAGO' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pag.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}