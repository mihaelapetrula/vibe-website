type Rezervare = {
  id: number
  numar_persoane: number
  data: string
  status: string
  sosit: boolean | null
}

type ZiStat = {
  data: string
  rezervari: number
  persoane: number
  sositi: number
}

export default function AdminStatistici({
  rezervari,
}: {
  rezervari: Rezervare[]
}) {
  // ── Carduri sumar ──────────────────────────────────────────────
  const total = rezervari.length
  const totalPersoane = rezervari.reduce((s, r) => s + r.numar_persoane, 0)
  const sositi = rezervari.filter((r) => r.sosit === true).length
  const neSositi = rezervari.filter((r) => r.sosit === false).length
  const rataPresenta = total > 0
    ? Math.round((sositi / total) * 100)
    : null

  // ── Pe zile ────────────────────────────────────────────────────
  const peZile = rezervari.reduce<Record<string, ZiStat>>((acc, r) => {
    if (!acc[r.data]) {
      acc[r.data] = { data: r.data, rezervari: 0, persoane: 0, sositi: 0 }
    }
    acc[r.data].rezervari += 1
    acc[r.data].persoane += r.numar_persoane
    if (r.sosit === true) acc[r.data].sositi += 1
    return acc
  }, {})

  const zile: ZiStat[] = Object.values(peZile).sort((a, b) =>
    a.data.localeCompare(b.data)
  )

  // max persoane pe zi — pentru scala barelor
  const maxPersoane = Math.max(...zile.map((z) => z.persoane), 1)

  function formatData(data: string) {
    const [an, luna, zi] = data.split('-')
    const luni = [
      '', 'ian', 'feb', 'mar', 'apr', 'mai', 'iun',
      'iul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ]
    return `${zi} ${luni[parseInt(luna)]} ${an}`
  }

  function ziuaSaptamanii(data: string) {
    const zile = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm']
    return zile[new Date(data).getDay()]
  }

  return (
    <div className="mb-10">
      {/* Carduri sumar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total rezervări</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total persoane</p>
          <p className="text-3xl font-bold text-[#C4956A]">{totalPersoane}</p>
        </div>

        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Au sosit</p>
          <p className="text-3xl font-bold text-teal-600">{sositi}</p>
          {neSositi > 0 && (
            <p className="text-xs text-gray-400 mt-1">{neSositi} nu au sosit</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Rată prezență</p>
          {rataPresenta !== null ? (
            <>
              <p className="text-3xl font-bold text-gray-900">{rataPresenta}%</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full transition-all"
                  style={{ width: `${rataPresenta}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-3xl font-bold text-gray-300">—</p>
          )}
        </div>
      </div>

      {/* Tabel pe zile */}
      {zile.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Rezervări pe zile</h2>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C4956A]" />
                rezervări
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-400" />
                persoane
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {zile.map((z) => {
              const barWidth = Math.round((z.persoane / maxPersoane) * 100)
              return (
                <div
                  key={z.data}
                  className="px-5 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Data */}
                    <div className="w-32 flex-shrink-0">
                      <span className="text-xs text-gray-400 mr-1">{ziuaSaptamanii(z.data)}</span>
                      <span className="text-sm font-medium text-gray-800">{formatData(z.data)}</span>
                    </div>

                    {/* Cifre */}
                    <div className="flex items-center gap-4 text-sm flex-shrink-0">
                      <span className="font-semibold text-gray-800">
                        {z.rezervari}
                        <span className="text-xs text-gray-400 font-normal ml-1">
                          {z.rezervari === 1 ? 'rez.' : 'rez.'}
                        </span>
                      </span>
                      <span className="font-semibold text-gray-800">
                        {z.persoane}
                        <span className="text-xs text-gray-400 font-normal ml-1">pers.</span>
                      </span>
                    </div>

                    {/* Bară persoane */}
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Badge sositi */}
                    {z.sositi > 0 && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium flex-shrink-0">
                        ✓ {z.sositi} sosit{z.sositi > 1 ? 'i' : ''}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
