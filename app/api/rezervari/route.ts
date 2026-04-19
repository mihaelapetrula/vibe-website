import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const STATUSURI_VALIDE = ['în așteptare', 'confirmat', 'respins']

// Schimbă statusul unei rezervări
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()

  if (!id || !STATUSURI_VALIDE.includes(status)) {
    return NextResponse.json({ success: false, message: 'Date invalide' }, { status: 400 })
  }

  const { error } = await supabase
    .from('rezervari')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// Șterge o rezervare
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID lipsă' }, { status: 400 })
  }

  const { error } = await supabase
    .from('rezervari')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
