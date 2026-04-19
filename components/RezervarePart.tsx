'use client'

import { useState } from 'react'
import { salveazaRezervare } from '@/app/actions/rezervari'

// ── helpers dată ───────────────────────────────────────────────
function formatDataISO(date: Date) {
  return date.toISOString().split('T')[0]
}

function formatDataFrumos(iso: string) {
  const [an, luna, zi] = iso.split('-')
  const luni = ['', 'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']
  return `${parseInt(zi)} ${luni[parseInt(luna)]} ${an}`
}

// ── ore disponibile 10:00 – 22:00 din 30 în 30 ────────────────
const ORE = Array.from({ length: 25 }, (_, i) => {
  const total = 10 * 60 + i * 30
  if (total > 22 * 60) return null
  const h = String(Math.floor(total / 60)).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return `${h}:${m}`
}).filter(Boolean) as string[]

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 placeholder-gray-400 transition text-sm'

export default function RezervarePart() {
  const azi = new Date()
  const maxData = new Date(azi)
  maxData.setMonth(maxData.getMonth() + 6)

  const [lunaCalendar, setLunaCalendar] = useState(
    new Date(azi.getFullYear(), azi.getMonth(), 1)
  )
  const [dataSelectata, setDataSelectata] = useState('')
  const [oraSelectata, setOraSelectata] = useState('')
  const [form, setForm] = useState({
    prenume: '',
    nume: '',
    email: '',
    telefon: '',
    numar_persoane: 2,
    observatii: '',
  })
  const [loading, setLoading] = useState(false)
  const [mesaj, setMesaj] = useState<{ text: string; success: boolean } | null>(null)

  // ── calendar ───────────────────────────────────────────────
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
    const offset = primaZi === 0 ? 6 : primaZi - 1
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

  // ── submit ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dataSelectata || !oraSelectata) return
    setLoading(true)
    setMesaj(null)

    const result = await salveazaRezervare({
      nume: `${form.prenume} ${form.nume}`.trim(),
      email: form.email,
      telefon: form.telefon,
      numar_persoane: form.numar_persoane,
      data: dataSelectata,
      ora: oraSelectata,
      observatii: form.observatii || undefined,
    })

    setMesaj({ text: result.message, success: result.success })
    setLoading(false)

    if (result.success) {
      setDataSelectata('')
      setOraSelectata('')
      setForm({ prenume: '', nume: '', email: '', telefon: '', numar_persoane: 2, observatii: '' })
    }
  }

  const formComplet = dataSelectata && oraSelectata && form.prenume && form.email && form.telefon

  return (
    <section id="rezervare" className="py-20 px-6 bg-[#FAFAFA]">
      <div className="max-w-2xl mx-auto">

        {/* Titlu */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Rezervă o masă
          </h2>
          <p className="text-gray-500">
            Îți confirmăm rezervarea în cel mai scurt timp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── 1. Calendar ───────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">1</span>
              Alege data
              {dataSelectata && (
                <span className="ml-auto text-sm text-teal-600 font-medium">
                  ✓ {formatDataFrumos(dataSelectata)}
                </span>
              )}
            </h3>

            {/* Navigare lună */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={lunaAnterioară}
                className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-lg leading-none"
              >
                ‹
              </button>
              <span className="font-semibold text-gray-800 capitalize text-sm">
                {lunaCalendar.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={lunaUrmătoare}
                className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-lg leading-none"
              >
                ›
              </button>
            </div>

            {/* Zile săptămână */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
              {['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'].map(z => (
                <div key={z} className="py-1">{z}</div>
              ))}
            </div>

            {/* Grid zile */}
            <div className="grid grid-cols-7 gap-1">
              {zileCalendar().map((d, i) => {
                if (!d) return <div key={i} />
                const val = formatDataISO(d)
                const disponibil = eDisponibila(d)
                const eAzi = val === formatDataISO(azi)
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={!disponibil}
                    onClick={() => setDataSelectata(val)}
                    className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                      dataSelectata === val
                        ? 'bg-teal-500 text-white shadow-md scale-105'
                        : disponibil
                        ? `hover:bg-teal-50 text-gray-800 ${eAzi ? 'ring-2 ring-teal-200' : ''}`
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 2. Ore ────────────────────────────────────── */}
          <div className={`bg-white rounded-2xl border shadow-sm p-6 transition-opacity ${dataSelectata ? 'border-gray-100 opacity-100' : 'border-gray-100 opacity-50 pointer-events-none'}`}>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold ${oraSelectata ? 'bg-teal-500' : 'bg-gray-300'}`}>2</span>
              Alege ora
              {oraSelectata && (
                <span className="ml-auto text-sm text-teal-600 font-medium">✓ {oraSelectata}</span>
              )}
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ORE.map(ora => (
                <button
                  key={ora}
                  type="button"
                  onClick={() => setOraSelectata(ora)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    oraSelectata === ora
                      ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-teal-50'
                  }`}
                >
                  {ora}
                </button>
              ))}
            </div>
          </div>

          {/* ── 3. Date personale ─────────────────────────── */}
          <div className={`bg-white rounded-2xl border shadow-sm p-6 transition-opacity ${oraSelectata ? 'border-gray-100 opacity-100' : 'border-gray-100 opacity-50 pointer-events-none'}`}>
            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold ${formComplet ? 'bg-teal-500' : 'bg-gray-300'}`}>3</span>
              Completează datele
            </h3>

            <div className="space-y-4">
              {/* Prenume + Nume */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Prenume"
                  value={form.prenume}
                  onChange={e => setForm(p => ({ ...p, prenume: e.target.value }))}
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Nume"
                  value={form.nume}
                  onChange={e => setForm(p => ({ ...p, nume: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Nr persoane */}
              <select
                value={form.numar_persoane}
                onChange={e => setForm(p => ({ ...p, numar_persoane: Number(e.target.value) }))}
                required
                className={inputClass}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'persoană' : 'persoane'}
                  </option>
                ))}
              </select>

              {/* Telefon */}
              <input
                type="tel"
                placeholder="Număr de telefon"
                value={form.telefon}
                onChange={e => setForm(p => ({ ...p, telefon: e.target.value }))}
                required
                className={inputClass}
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Adresă email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className={inputClass}
              />

              {/* Observații */}
              <textarea
                placeholder="Observații (opțional) — alergii, ocazie specială, preferințe masă..."
                value={form.observatii}
                onChange={e => setForm(p => ({ ...p, observatii: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* ── Submit ────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading || !formComplet}
            className="w-full py-4 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              'Trimite rezervarea ☕'
            )}
          </button>

          {/* Mesaj rezultat */}
          {mesaj && (
            <div className={`text-center font-medium py-4 rounded-xl text-sm ${
              mesaj.success
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {mesaj.text}
            </div>
          )}

        </form>
      </div>
    </section>
  )
}
