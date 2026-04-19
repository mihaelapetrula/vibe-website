import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { login, logout } from '@/app/actions/auth'
import AdminDashboard from '@/components/AdminDashboard'

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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const params = await searchParams

  // ── Pagina de login ──────────────────────────────────────────
  if (session?.value !== 'authenticated') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vibe Caffè</h1>
            <p className="text-gray-500 mt-1">Panou de administrare</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Autentificare</h2>

            {params.error && (
              <p className="mb-5 text-sm text-red-600 bg-red-50 py-3 px-4 rounded-xl">
                Username sau parolă incorectă.
              </p>
            )}

            <form action={login} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-400 transition"
              />
              <input
                type="password"
                name="password"
                placeholder="Parolă"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800 placeholder-gray-400 transition"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold transition-all"
              >
                Intră în admin
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ── Dashboard rezervări ──────────────────────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rezervari } = await supabase
    .from('rezervari')
    .select('*')
    .order('data', { ascending: true })
    .order('ora', { ascending: true })

  const lista: Rezervare[] = rezervari ?? []

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vibe Caffè — Admin</h1>
            <p className="text-sm text-gray-400">Rezervări ({lista.length})</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
            >
              ← Înapoi la site
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition"
              >
                Deconectare
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <AdminDashboard rezervari={lista} />
      </div>
    </div>
  )
}
