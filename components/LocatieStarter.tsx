export default function LocatieStarter() {
  return (
    <section id="locatie" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Titlu */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Unde ne găsești</h2>
          <p className="text-gray-500 mt-3 text-lg">Vino să ne vizitezi în inima Iașului</p>
        </div>

        {/* Grid: info stânga + hartă dreapta */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Informații */}
          <div className="space-y-8">

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                📍
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Adresă</h3>
                <p className="text-gray-600">Strada Exemplu nr. 10</p>
                <p className="text-gray-600">Iași, România</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                🕐
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Program</h3>
                <p className="text-gray-600">Luni – Vineri: 08:00 – 22:00</p>
                <p className="text-gray-600">Sâmbătă – Duminică: 09:00 – 23:00</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                📞
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Contact</h3>
                <p className="text-gray-600">+40 700 000 000</p>
                <p className="text-gray-600">contact@vibecaffe.ro</p>
              </div>
            </div>

            <a
              href="#rezervare"
              className="inline-block mt-2 px-8 py-4 bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Rezervă o masă
            </a>

          </div>

          {/* Hartă Google Maps */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[420px]">
            <iframe
              src="https://maps.google.com/maps?q=Iasi,Romania&output=embed&z=15"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
