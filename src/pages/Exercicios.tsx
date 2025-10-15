import React, { useEffect, useState } from 'react'
import api from '../services/api'

type Ex = { id:number; nome:string; series:number; repeticoes:number; treinoId:number }

export default function Exercicios() {
  const [exs, setExs] = useState<Ex[]>([])
  const [nome, setNome] = useState('')
  const [series, setSeries] = useState(3)
  const [repeticoes, setRepeticoes] = useState(10)
  const [treinoId, setTreinoId] = useState(0)

  async function load() {
    try {
      const resp = await api.get('/exercicios')
      setExs(resp.data)
    } catch (err) { console.error(err) }
  }

  useEffect(()=>{ load() },[])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/exercicios', { nome, series: Number(series), repeticoes: Number(repeticoes), treinoId: Number(treinoId) })
      setNome(''); setSeries(3); setRepeticoes(10); setTreinoId(0)
      load()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id:number) {
    if(!confirm('Deletar exercício?')) return
    try {
      await api.delete(`/exercicios/${id}`)
      load()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Exercícios</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={handleCreate} className="space-y-3">
            <div><label className="text-sm">Nome</label><input value={nome} onChange={e=>setNome(e.target.value)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">Séries</label><input type="number" value={series} onChange={e=>setSeries(Number(e.target.value))} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">Repetições</label><input type="number" value={repeticoes} onChange={e=>setRepeticoes(Number(e.target.value))} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-sm">TreinoId</label><input type="number" value={treinoId} onChange={e=>setTreinoId(Number(e.target.value))} className="w-full border px-2 py-1 rounded" /></div>
            <button className="bg-green-600 text-white px-3 py-1 rounded">Criar</button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Lista</h2>
          <ul className="space-y-2">
            {exs.map(ex=>(
              <li key={ex.id} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div className="font-semibold">{ex.nome}</div>
                  <div className="text-sm">Séries: {ex.series} — Reps: {ex.repeticoes}</div>
                  <div className="text-xs text-gray-600">TreinoId: {ex.treinoId}</div>
                </div>
                <div>
                  <button onClick={()=>handleDelete(ex.id)} className="bg-red-500 text-white px-2 py-1 rounded">Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
