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
}

export async function salveazaRezervare(formData: RezervareFormData) {
  const { error } = await supabase.from('rezervari').insert({
    ...formData,
    status: 'în așteptare',
  })

  if (error) {
    return { success: false, message: 'A apărut o eroare. Încearcă din nou.' }
  }

  return { success: true, message: 'Rezervarea a fost trimisă cu succes!' }
}
