'use client'

import { useState } from 'react'
import { salveazaRezervare } from '@/app/actions/rezervari'

// ── helpers dată ──────────────────────────────────────────────
function formatData(date: Date) {
  return date.toISOString().split('T')[0]
}

function genereazaUrmătoarele14Zile() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

function numeZi(date: Date) {
  return date.toLocaleDateString('ro-RO', { weekday: 'short' })
}

function numeZiLuna(date: Date) {
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
}

// ── ore disponibile 10:00 – 22:00 din 30 în 30 ───────────────
const ORE = Array.from({ length: 25 }, (_, i) => {
  const total = 10 * 60 + i * 30
  if (total > 22 * 60) return null
  const h = String(Math.floor(total / 60)).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return `${h}:${m}`
}).filter(Boolean) as string[]

// ── tipuri ────────────────────────────────────────────────────
type Pas = 'data' | 'ora' | 'detalii' | 'confirmat'

export default function RezervariPage() {
  const [pas, setPas] = useState<Pas>('data')
  const [dataSelectata, setDataSelectata] = useState<string>('')
  const [oraSelectata, setOraSelectata] = useState<string>('')
  const [form, setForm] = useState({ nume: '', email: '', telefon: '', numar_persoane: 2 })
  const [loading, setLoading] = useState(false)
  const [eroare, setEroare] = useState('')

  // calendar cu navigare pe luni
  const azi = new Date()
  const maxData = new Date(azi)
  maxData.setMonth(maxData.getMonth() + 6)

  const [lunaCalendar, setLunaCalendar] = useState(new Date(azi.getFullYear(), azi.getMonth(), 1))

  function lunaAnterioară() {
    const prev = new Date(lunaCalendar)
    prev.setMonth(prev.getMonth() - 1)
    if (prev >= new Date(azi.getFullYear(), azi.getMonth(), 1)) setLunaCalendar(prev)
  }

  function lunaUrmătoare() {
    const next = new Date(lunaCalendar)
    next.setMonth(next.getMonth() + 1)
    if (next <= new Date(maxData.getFullYear(), maxData.getMonth(), 1)) setLunaCalendar(next)
  }

  function zileCalendar() {
    const an = lunaCalendar.getFullYear()
    const luna = lunaCalendar.getMonth()
    const primaZi = new Date(an, luna, 1).getDay()
    const offset = primaZi === 0 ? 6 : primaZi - 1 // luni = 0
    const totalZile = new Date(an, luna + 1, 0).getDate()
    const celule: (Date | null)[] = Array(offset).fill(null)
    for (let i = 1; i <= totalZile; i++) celule.push(new Date(an, luna, i))
    return celule
  }

  function eDisponibila(d: Date) {
    const start = new Date(azi); start.setHours(0, 0, 0, 0)
    const end = new Date(maxData); end.setHours(23, 59, 59, 999)
    return d >= start && d <= end
  }

  async function handleSubmit() {
    setLoading(true)
    setEroare('')
    const result = await salveazaRezervare({
      ...form,
      data: dataSelectata,
      ora: oraSelectata,
    })
    setLoading(false)
    if (result.success) {
      setPas('confirmat')
    } else {
      setEroare(result.message)
    }
  }

  function rezervareNoua() {
    setPas('data')
    setDataSelectata('')
    setOraSelectata('')
    setForm({ nume: '', email: '', telefon: '', numar_persoane: 2 })
    setEroare('')
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-400 transition'

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">

        {/* ── header ── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Rezervă o masă</h1>
          <p className="text-gray-500 mt-2">Vibe Caffè · Iași</p>
        </div>

        {/* ── indicator pași ── */}
        {pas !== 'confirmat' && (
          <div className="flex items-center justify-center gap-3 mb-10">
            {(['data', 'ora', 'detalii'] as Pas[]).map((p, i) => (
              <div key={p} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  pas === p ? 'bg-[#C4956A] text-white scale-110' :
                  ['data', 'ora', 'detalii'].indexOf(pas) > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {['data', 'ora', 'detalii'].indexOf(pas) > i ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`w-16 h-0.5 ${['data', 'ora', 'detalii'].indexOf(pas) > i ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════
            PAS 1 — ALEGE DATA
        ════════════════════════════════ */}
        {pas === 'data' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Alege data</h2>

            {/* butoane rapide 14 zile */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {genereazaUrmătoarele14Zile().map(d => {
                const val = formatData(d)
                return (
                  <button
                    key={val}
                    onClick={() => setDataSelectata(val)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      dataSelectata === val
                        ? 'bg-[#C4956A] text-white border-[#C4956A]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C4956A]'
                    }`}
                  >
                    <span className="text-xs opacity-75">{numeZi(d)}</span>
                    <span>{numeZiLuna(d)}</span>
                  </button>
                )
              })}
            </div>

            {/* calendar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <button onClick={lunaAnterioară} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">‹</button>
                <span className="font-semibold text-gray-800 capitalize">
                  {lunaCalendar.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={lunaUrmătoare} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">›</button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                {['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'].map(z => <div key={z}>{z}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {zileCalendar().map((d, i) => {
                  if (!d) return <div key={i} />
                  const val = formatData(d)
                  const disponibil = eDisponibila(d)
                  return (
                    <button
                      key={val}
                      disabled={!disponibil}
                      onClick={() => setDataSelectata(val)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        dataSelectata === val
                          ? 'bg-[#C4956A] text-white'
                          : disponibil
                          ? 'hover:bg-amber-50 text-gray-800'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              disabled={!dataSelectata}
              onClick={() => setPas('ora')}
              className="mt-6 w-full py-4 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuă →
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            PAS 2 — ALEGE ORA
        ════════════════════════════════ */}
        {pas === 'ora' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button onClick={() => setPas('data')} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
              ← Înapoi
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Alege ora</h2>
            <p className="text-sm text-gray-400 mb-5">{dataSelectata}</p>

            <div className="grid grid-cols-4 gap-2">
              {ORE.map(ora => (
                <button
                  key={ora}
                  onClick={() => setOraSelectata(ora)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                    oraSelectata === ora
                      ? 'bg-[#C4956A] text-white border-[#C4956A]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C4956A]'
                  }`}
                >
                  {ora}
                </button>
              ))}
            </div>

            <button
              disabled={!oraSelectata}
              onClick={() => setPas('detalii')}
              className="mt-6 w-full py-4 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuă →
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            PAS 3 — DETALII
        ════════════════════════════════ */}
        {pas === 'detalii' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button onClick={() => setPas('ora')} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
              ← Înapoi
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Completează detaliile</h2>
            <p className="text-sm text-gray-400 mb-5">{dataSelectata} · {oraSelectata}</p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nume complet"
                value={form.nume}
                onChange={e => setForm(p => ({ ...p, nume: e.target.value }))}
                required
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Adresă email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className={inputClass}
              />
              <input
                type="tel"
                placeholder="Număr de telefon"
                value={form.telefon}
                onChange={e => setForm(p => ({ ...p, telefon: e.target.value }))}
                required
                className={inputClass}
              />
              <select
                value={form.numar_persoane}
                onChange={e => setForm(p => ({ ...p, numar_persoane: Number(e.target.value) }))}
                className={inputClass}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'persoană' : 'persoane'}
                  </option>
                ))}
              </select>
            </div>

            {eroare && (
              <p className="mt-4 text-center text-sm text-red-600 bg-red-50 py-3 rounded-xl">{eroare}</p>
            )}

            <button
              disabled={loading || !form.nume || !form.email || !form.telefon}
              onClick={handleSubmit}
              className="mt-6 w-full py-4 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Se trimite...
                </>
              ) : (
                'Trimite rezervarea'
              )}
            </button>
          </div>
        )}

        {/* ════════════════════════════════
            CONFIRMAT
        ════════════════════════════════ */}
        {pas === 'confirmat' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rezervare confirmată!</h2>
            <p className="text-gray-500 mb-1">{form.nume}</p>
            <p className="text-gray-500 mb-1">{dataSelectata} · {oraSelectata}</p>
            <p className="text-gray-500 mb-8">{form.numar_persoane} {form.numar_persoane === 1 ? 'persoană' : 'persoane'}</p>
            <button
              onClick={rezervareNoua}
              className="px-8 py-3 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold transition-all hover:scale-105"
            >
              Rezervare nouă
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
