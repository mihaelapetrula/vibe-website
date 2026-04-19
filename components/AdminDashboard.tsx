'use client'

import { useState } from 'react'
import AdminStatistici from './AdminStatistici'
import AdminRezervariTable from './AdminRezervariTable'

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

export default function AdminDashboard({
  rezervari: initial,
}: {
  rezervari: Rezervare[]
}) {
  const [lista, setLista] = useState(initial)

  return (
    <>
      <AdminStatistici rezervari={lista} />
      <AdminRezervariTable rezervari={lista} setLista={setLista} />
    </>
  )
}
