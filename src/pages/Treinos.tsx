import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Treino = { id: number; nome: string; descricao?: string; aluno?: any; instrutor?: any; exercicios?: any[] }

export default function Treinos() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [alunoId, setAlunoId] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [instrutorId, setInstrutorId] = useState('')

  async function loadAll() {
    try {
      const resp = await api.get('/treinos')
      setTreinos(resp.data)
    } catch (err) { console.error(err) }
  }

  async function loadByAluno() {
    if (!alunoId) return loadAll()
    try {
      const resp = await api.get(`/treinos/${alunoId}`)
      setTreinos(resp.data)
    } catch (err) { console.error(err) }
  }

  useEffect(()=>{ loadAll() },[])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/treinos', { nome, descricao, alunoId: Number(alunoId), instrutorId: Number(instrutorId) })
      setNome(''); setDescricao(''); setAlunoId(''); setInstrutorId('')
      loadAll()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Treinos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Criar Treino</h2>
          <form onSubmit={handleCreate} className="space-y-3 mt-2">
            <div><label className="text-sm">Nome</label><input value={nome} onChange={e=>setNome(e.target.value)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">Descrição</label><input value={descricao} onChange={e=>setDescricao(e.target.value)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">AlunoId</label><input value={alunoId} onChange={e=>setAlunoId(e.target.value)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">InstrutorId</label><input value={instrutorId} onChange={e=>setInstrutorId(e.target.value)} className="w-full border px-2 py-1 rounded" /></div>
            <button className="bg-green-600 text-white px-3 py-1 rounded">Criar</button>
          </form>
          <div className="mt-4">
            <label className="text-sm">Buscar treinos por alunoId</label>
            <div className="flex gap-2 mt-2">
              <input value={alunoId} onChange={e=>setAlunoId(e.target.value)} className="border px-2 py-1 rounded" />
              <button onClick={loadByAluno} className="bg-blue-600 text-white px-3 py-1 rounded">Buscar</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Lista de Treinos</h2>
          <ul className="space-y-2">
            {treinos.map(t=>(
              <li key={t.id} className="border p-2 rounded">
                <div className="font-semibold">{t.nome} (#{t.id})</div>
                <div className="text-sm">{t.descricao}</div>
                <div className="text-xs text-gray-600">Aluno: {t.aluno?.nome || '-' } | Instrutor: {t.instrutor?.nome || '-'}</div>
                <div className="mt-1">
                  Exercícios:
                  <ul className="list-disc ml-5">
                    {t.exercicios?.map((ex:any)=> <li key={ex.id}>{ex.nome} — {ex.series}x{ex.repeticoes}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
