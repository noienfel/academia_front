import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [counts, setCounts] = useState({ alunos: 0, treinos: 0, exercicios: 0 })

  useEffect(()=> {
    async function load() {
      try {
        const [al, tr, ex] = await Promise.all([
          api.get('/alunos'),

          api.get('/treinos'),
          api.get('/exercicios')
        ])
        setCounts({ alunos: al.data.length || 0, treinos: tr.data.length || 0, exercicios: ex.data.length || 0 })
      } catch (err) {
        // ignore for now
      }
    }
    load()
  },[])

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/alunos" className="p-6 bg-blue-50 text-blue-800 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <div className="text-sm font-semibold">Alunos</div>
          <div className="text-3xl font-extrabold mt-1">{counts.alunos}</div>
        </Link>
        <Link to="/treinos" className="p-6 bg-yellow-50 text-yellow-800 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <div className="text-sm font-semibold">Treinos</div>
          <div className="text-3xl font-extrabold mt-1">{counts.treinos}</div>
        </Link>
        <Link to="/exercicios" className="p-6 bg-purple-50 text-purple-800 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <div className="text-sm font-semibold">Exercícios</div>
          <div className="text-3xl font-extrabold mt-1">{counts.exercicios}</div>
        </Link>
      </div>
    </div>
  )
}