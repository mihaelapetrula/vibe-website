'use client';

/**
 * 🎯 HERO STARTER - Versiunea simplă pentru cursanți
 *
 * Aceasta este versiunea MINIMALISTĂ de la care plecăm în curs.
 * Fundal cu video cappuccino + scroll smooth cu offset -80px.
 */

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function HeroStarter() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* VIDEO FUNDAL CAPPUCCINO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-coffee1.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY negru 50% */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONȚINUT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-amber-50">

        {/* BADGE */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-amber-100 text-sm font-medium tracking-widest uppercase"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
        >
          ☕ Specialty Coffee · Iași
        </div>

        {/* TITLU PRINCIPAL */}
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight"
          style={{
            textShadow: '0 4px 24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 0.8s ease-out 0.5s both',
          }}
        >
          Cafeaua celor care schimbă vieți
        </h1>

        {/* SUBTITLU */}
        <p
          className="text-xl md:text-3xl mb-8 text-amber-100/90 font-bold italic tracking-wide"
          style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            animation: 'fadeInUp 0.8s ease-out 0.8s both',
          }}
        >
          Vino pentru cafea, rămâi pentru atmosferă
        </p>

        {/* BUTOANE CTA */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ animation: 'fadeInUp 0.8s ease-out 1.1s both' }}
        >
          {/* Rândul 1 — 2 butoane */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            {/* Buton 1 - Vezi meniul → scroll la #meniu */}
            <button
              onClick={() => scrollTo('meniu')}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Vezi meniul
            </button>

            {/* Buton 2 - Vizitează-ne */}
            <button
              onClick={() => scrollTo('locatie')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/10"
            >
              Vizitează-ne
            </button>

          </div>

          {/* Rândul 2 — buton centrat */}
          <button
            onClick={() => scrollTo('rezervare')}
            className="px-8 py-4 bg-[#C4956A] hover:bg-[#A0724A] text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Vreau rezervare
          </button>

        </div>

        {/* CIFRE CREDIBILITATE */}
        <div
          className="mt-6 flex justify-center gap-6 text-white/60 text-sm font-medium tracking-wide"
          style={{ animation: 'fadeInUp 0.8s ease-out 1.4s both' }}
        >
          <span>500+ clienți</span>
          <span>·</span>
          <span>15 sortimente</span>
          <span>·</span>
          <span>Deschis 7/7</span>
        </div>
      </div>

      {/* SCROLL INDICATOR → scroll la #features */}
      <button
        onClick={() => scrollTo('features')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/75 hover:text-orange-500 active:text-orange-600 transition-colors duration-300"
        style={{ animation: 'fadeInUp 0.8s ease-out 1.5s both, bounce 1s infinite 2.3s' }}
        aria-label="Scroll mai jos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 7l6 6 6-6" />
          <path d="M6 13l6 6 6-6" />
        </svg>
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>

    </section>
  );
}
