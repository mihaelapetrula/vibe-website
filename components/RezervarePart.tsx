'use client'

import { useState, useEffect } from 'react'
import { salveazaRezervare } from '@/app/actions/rezervari'
import { supabase } from '@/lib/supabase'

type Rezervare = {
  id: number
  nume: string
  email: string
  telefon: string
  numar_persoane: number
  data: string
  ora: string
  status: string
  created_at: string
}

export default function RezervarePart() {
  const [form, setForm] = useState({
    nume: '',
    email: '',
    telefon: '',
    numar_persoane: 2,
    data: '',
    ora: '',
  })
  const [loading, setLoading] = useState(false)
  const [mesaj, setMesaj] = useState<{ text: string; success: boolean } | null>(null)
  const [rezervari, setRezervari] = useState<Rezervare[]>([])

  async function incarcaRezervari() {
    const { data } = await supabase
      .from('rezervari')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setRezervari(data)
  }

  useEffect(() => {
    incarcaRezervari()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'numar_persoane' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMesaj(null)

    const result = await salveazaRezervare(form)
    setMesaj({ text: result.message, success: result.success })
    setLoading(false)

    if (result.success) {
      setForm({ nume: '', email: '', telefon: '', numar_persoane: 2, data: '', ora: '' })
      incarcaRezervari()
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-400 transition'

  return (
    <section id="rezervare" className="py-20 px-6 bg-[#FAFAFA]">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center">
          Rezervă o masă
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Îți confirmăm rezervarea în cel mai scurt timp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nume"
            placeholder="Nume complet"
            value={form.nume}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            type="email"
            name="email"
            placeholder="Adresă email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            type="tel"
            name="telefon"
            placeholder="Număr de telefon"
            value={form.telefon}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <select
            name="numar_persoane"
            value={form.numar_persoane}
            onChange={handleChange}
            required
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'persoană' : 'persoane'}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={inputClass}
            />
            <input
              type="time"
              name="ora"
              value={form.ora}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Se trimite...' : 'Trimite rezervarea'}
          </button>

          {mesaj && (
            <p
              className={`text-center font-medium py-3 rounded-xl ${
                mesaj.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {mesaj.text}
            </p>
          )}
        </form>

        {rezervari.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Rezervări ({rezervari.length})
            </h3>
            <div className="space-y-4">
              {rezervari.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{r.nume}</p>
                      <p className="text-sm text-gray-500">{r.email} · {r.telefon}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm text-gray-600">
                    <span>📅 {r.data}</span>
                    <span>🕐 {r.ora}</span>
                    <span>👥 {r.numar_persoane} {r.numar_persoane === 1 ? 'persoană' : 'persoane'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
