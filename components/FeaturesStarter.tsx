'use client';

/**
 * ✨ FEATURES STARTER - Secțiunea "De ce Vibe Coffee?"
 * Layout Bento Grid: 1 card mare stânga + 2 carduri mici dreapta
 * Cu imagini Unsplash + hover effects + animații la scroll
 */

import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function FeaturesStarter() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { elementRef: card1Ref, isVisible: card1Visible } = useScrollAnimation(0.15);
  const { elementRef: card2Ref, isVisible: card2Visible } = useScrollAnimation(0.15);
  const { elementRef: card3Ref, isVisible: card3Visible } = useScrollAnimation(0.15);

  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div
          ref={titleRef}
          className={`text-center mb-14 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            De ce Vibe Coffee?
          </h2>
          <p className="text-lg text-gray-500">
            Experiență unică, ingrediente premium, atmosferă perfectă
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD MARE — stânga */}
          <div
            ref={card1Ref}
            className={`group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[420px] transition-all duration-700 hover:shadow-xl ${
              card1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            {/* Imagine 40% */}
            <div className="h-[40%] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop"
                alt="Cafea de specialitate"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* Text 60% */}
            <div className="flex flex-col justify-between flex-1 p-8">
              <div>
                <span className="text-3xl mb-4 block">☕</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Cafea de Specialitate
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Boabe selectate din cele mai bune origini din lume, prăjite local și preparate cu grijă de bariștii noștri. Fiecare ceașcă este o experiență în sine.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center text-amber-600 font-semibold">
                Descoperă meniul →
              </div>
            </div>
          </div>

          {/* CARDURI MICI — dreapta */}
          <div className="flex flex-col gap-6">

            {/* Card mic sus */}
            <div
              ref={card2Ref}
              className={`group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 transition-all duration-700 hover:shadow-xl ${
                card2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              {/* Imagine 40% */}
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop"
                  alt="Patiserie artizanală"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Text 60% */}
              <div className="p-6 flex-1">
                <span className="text-2xl mb-3 block">🥐</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Patiserie Artizanală
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Croissante, prăjituri și deserturi pregătite în fiecare dimineață. Perfecte alături de cafeaua ta.
                </p>
              </div>
            </div>

            {/* Card mic jos */}
            <div
              ref={card3Ref}
              className={`group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 transition-all duration-700 hover:shadow-xl ${
                card3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {/* Imagine 40% */}
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop"
                  alt="Ambient relaxant"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Text 60% */}
              <div className="p-6 flex-1">
                <span className="text-2xl mb-3 block">🌿</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ambient Relaxant
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Un spațiu gândit pentru conversații profunde și momente de liniște. Locul preferat al terapeuților din Iași.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SCROLL INDICATOR → către Meniu */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            const el = document.getElementById('meniu');
            if (!el) return;
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
          }}
          className="text-gray-400 hover:text-amber-500 transition-colors duration-300 animate-bounce"
          aria-label="Scroll către meniu"
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
      </div>

    </section>
  );
}
