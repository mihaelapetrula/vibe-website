'use client'

import { useTransition, useState, type Dispatch, type SetStateAction } from 'react'
import { marcheazaSosit } from '@/app/actions/rezervari'

type Rezervare = {
  id: number
  nume: string
  email: string
  telefon: string
  numar_persoane: number
  data: string
  ora: string
  status: string
  sosit: boolean | null
  created_at: string
}

const STATUS_CFG: Record<string, { label: string; badge: string; btn: string }> = {
  'în așteptare': {
    label: '⏳ În așteptare',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    btn: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
  },
  confirmat: {
    label: '✅ Confirmat',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    btn: 'border-teal-300 text-teal-700 hover:bg-teal-50',
  },
  respins: {
    label: '❌ Respins',
    badge: 'bg-red-50 text-red-600 border-red-200',
    btn: 'border-red-300 text-red-600 hover:bg-red-50',
  },
}

const FILTRE = ['toate', 'în așteptare', 'confirmat', 'respins']

function formatData(data: string) {
  const [an, luna, zi] = data.split('-')
  const luni = ['', 'ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'nov', 'dec']
  return `${zi} ${luni[parseInt(luna)]} ${an}`
}

export default function AdminRezervariTable({
  rezervari: lista,
  setLista,
}: {
  rezervari: Rezervare[]
  setLista: Dispatch<SetStateAction<Rezervare[]>>
}) {
  const [, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [eroare, setEroare] = useState<string | null>(null)
  const [cautare, setCautare] = useState('')
  const [filtru, setFiltru] = useState('toate')
  const [sortCol, setSortCol] = useState<'data' | 'ora'>('data')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function toggleSort(col: 'data' | 'ora') {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const vizibile = lista
    .filter((r) => {
      const matchFiltru = filtru === 'toate' || r.status === filtru
      const matchCautare = r.nume.toLowerCase().includes(cautare.toLowerCase())
      return matchFiltru && matchCautare
    })
    .sort((a, b) => {
      const valA = sortCol === 'data' ? `${a.data} ${a.ora}` : `${a.ora} ${a.data}`
      const valB = sortCol === 'data' ? `${b.data} ${b.ora}` : `${b.ora} ${b.data}`
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })

  function handleSosit(id: number, nouaSosit: boolean) {
    setEroare(null)
    setLoadingId(id)
    startTransition(async () => {
      const result = await marcheazaSosit(id, nouaSosit)
      if (result.success) {
        setLista((prev) => prev.map((r) => (r.id === id ? { ...r, sosit: nouaSosit } : r)))
      } else {
        setEroare(result.error ?? 'Eroare')
      }
      setLoadingId(null)
    })
  }

  async function handleStatus(id: number, status: string) {
    setEroare(null)
    setLoadingId(id)
    const res = await fetch('/api/rezervari', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    const data = await res.json()
    if (data.success) {
      setLista((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    } else {
      setEroare(data.message ?? 'Eroare la schimbarea statusului')
    }
    setLoadingId(null)
  }

  async function handleSterge(id: number) {
    if (!confirm('Sigur vrei să ștergi această rezervare?')) return
    setEroare(null)
    setLoadingId(id)
    const res = await fetch('/api/rezervari', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      setLista((prev) => prev.filter((r) => r.id !== id))
    } else {
      setEroare(data.message ?? 'Eroare la ștergere')
    }
    setLoadingId(null)
  }

  return (
    <div>
      {/* Bara de căutare + filtre */}
      <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Căutare */}
          <input
            type="text"
            placeholder="🔍 Caută după nume..."
            value={cautare}
            onChange={(e) => setCautare(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 placeholder-gray-400 text-sm transition"
          />

          {/* Filtre status */}
          <div className="flex gap-2 flex-wrap">
            {FILTRE.map((f) => {
              const count = f === 'toate' ? lista.length : lista.filter((r) => r.status === f).length
              const isActive = filtru === f
              return (
                <button
                  key={f}
                  onClick={() => setFiltru(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  {f === 'toate' ? 'Toate' : STATUS_CFG[f]?.label ?? f}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {eroare && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {eroare}
        </div>
      )}

      {vizibile.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          {cautare ? `Niciun rezultat pentru „${cautare}"` : 'Nu există rezervări.'}
        </div>
      ) : (
        <>
          {/* ── TABEL desktop ── */}
          <div className="hidden md:block bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Nume</th>
                  <th className="text-left px-5 py-3 font-medium">Contact</th>
                  <th className="text-left px-5 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleSort('data')} className={`flex items-center gap-1 hover:text-teal-600 transition ${sortCol === 'data' ? 'text-teal-600' : ''}`}>
                        Data {sortCol === 'data' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </button>
                      <span className="text-gray-300">/</span>
                      <button onClick={() => toggleSort('ora')} className={`flex items-center gap-1 hover:text-teal-600 transition ${sortCol === 'ora' ? 'text-teal-600' : ''}`}>
                        Ora {sortCol === 'ora' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </button>
                    </div>
                  </th>
                  <th className="text-center px-5 py-3 font-medium">Pers.</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Înregistrată</th>
                  <th className="text-center px-5 py-3 font-medium">Sosit</th>
                  <th className="text-right px-5 py-3 font-medium">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vizibile.map((r) => {
                  const isLoading = loadingId === r.id
                  const cfg = STATUS_CFG[r.status] ?? STATUS_CFG['în așteptare']
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-gray-50/60 transition ${isLoading ? 'opacity-50' : ''}`}
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900">{r.nume}</td>
                      <td className="px-5 py-4 text-gray-500">
                        <div>{r.email}</div>
                        <div className="text-xs">{r.telefon}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        <div>{formatData(r.data)}</div>
                        <div className="text-xs text-gray-400">{r.ora}</div>
                      </td>
                      <td className="px-5 py-4 text-center text-gray-700">{r.numar_persoane}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        <div className="text-xs">{new Date(r.created_at).toLocaleDateString('ro-RO')}</div>
                        <div className="text-xs text-gray-400">{new Date(r.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          disabled={isLoading}
                          onClick={() => handleSosit(r.id, r.sosit !== true)}
                          className={`w-8 h-8 rounded-full border-2 font-bold transition-all disabled:opacity-40 ${
                            r.sosit
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'bg-white border-gray-200 text-gray-300 hover:border-teal-400'
                          }`}
                        >
                          {r.sosit ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== 'confirmat' && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleStatus(r.id, 'confirmat')}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-teal-300 text-teal-700 hover:bg-teal-50 transition disabled:opacity-40"
                            >
                              Confirmă
                            </button>
                          )}
                          {r.status !== 'respins' && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleStatus(r.id, 'respins')}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                            >
                              Respinge
                            </button>
                          )}
                          <button
                            disabled={isLoading}
                            onClick={() => handleSterge(r.id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-40"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── CARDURI mobile ── */}
          <div className="md:hidden space-y-3">
            {vizibile.map((r) => {
              const isLoading = loadingId === r.id
              const cfg = STATUS_CFG[r.status] ?? STATUS_CFG['în așteptare']
              return (
                <div
                  key={r.id}
                  className={`bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-4 transition ${isLoading ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900">{r.nume}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{r.email} · {r.telefon}</p>
                      <div className="mt-2 flex gap-3 text-sm text-gray-600">
                        <span>📅 {formatData(r.data)}</span>
                        <span>🕐 {r.ora}</span>
                        <span>👥 {r.numar_persoane}</span>
                      </div>
                    </div>
                    <button
                      disabled={isLoading}
                      onClick={() => handleSosit(r.id, r.sosit !== true)}
                      className={`flex-shrink-0 w-10 h-10 rounded-full border-2 font-bold text-lg transition disabled:opacity-40 ${
                        r.sosit
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'bg-white border-gray-200 text-gray-300 hover:border-teal-400'
                      }`}
                    >
                      {r.sosit ? '✓' : '○'}
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {r.status !== 'confirmat' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleStatus(r.id, 'confirmat')}
                        className="text-xs px-3 py-1.5 rounded-lg border border-teal-300 text-teal-700 hover:bg-teal-50 transition disabled:opacity-40"
                      >
                        ✅ Confirmă
                      </button>
                    )}
                    {r.status !== 'respins' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleStatus(r.id, 'respins')}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                      >
                        ❌ Respinge
                      </button>
                    )}
                    {r.status !== 'în așteptare' && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleStatus(r.id, 'în așteptare')}
                        className="text-xs px-3 py-1.5 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 transition disabled:opacity-40"
                      >
                        ⏳ Repune în așteptare
                      </button>
                    )}
                    <button
                      disabled={isLoading}
                      onClick={() => handleSterge(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-40 ml-auto"
                    >
                      🗑 Șterge
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
