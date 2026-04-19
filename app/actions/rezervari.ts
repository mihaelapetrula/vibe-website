'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type RezervareFormData = {
  nume: string
  email: string
  telefon: string
  numar_persoane: number
  data: string
  ora: string
  observatii?: string
}

function oraInMinute(ora: string): number {
  const [h, m] = ora.split(':').map(Number)
  return h * 60 + m
}

export async function salveazaRezervare(formData: RezervareFormData) {
  const { data: rezervariExistente } = await supabase
    .from('rezervari')
    .select('ora')
    .eq('email', formData.email)
    .eq('data', formData.data)

  if (rezervariExistente && rezervariExistente.length > 0) {
    const noua = oraInMinute(formData.ora)

    for (const r of rezervariExistente) {
      const existenta = oraInMinute(r.ora)
      const diferentaOre = Math.abs(noua - existenta) / 60

      if (diferentaOre < 3) {
        return {
          success: false,
          message: `Ai deja o rezervare la ${r.ora} în aceeași zi. Nu poți face două rezervări la mai puțin de 3 ore distanță.`,
        }
      }
    }
  }

  const { error } = await supabase.from('rezervari').insert({
    ...formData,
    status: 'în așteptare',
  })

  if (error) {
    return { success: false, message: 'A apărut o eroare. Încearcă din nou.' }
  }

  return { success: true, message: 'Locul tău e rezervat. Te așteptăm cu cafeaua caldă! ☕' }
}

export async function stergeRezervare(id: number) {
  const { error } = await supabase.from('rezervari').delete().eq('id', id)
  if (error) return { success: false }
  return { success: true }
}

export async function schimbaStatus(id: number, status: string) {
  const { error } = await supabase
    .from('rezervari')
    .update({ status })
    .eq('id', id)
  if (error) return { success: false }
  return { success: true }
}

export async function marcheazaSosit(id: number, sosit: boolean) {
  const { error } = await supabase
    .from('rezervari')
    .update({ sosit })
    .eq('id', id)
  if (error) {
    console.error('marcheazaSosit error:', error.message)
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}
