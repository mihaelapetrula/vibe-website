'use client';

/**
 * ☕ MENU STARTER - Secțiunea "Meniul Nostru"
 * Tab-uri categorii + grid produse cu imagini Unsplash
 * Hover effects + fade-in la switch tab
 */

import { useState } from 'react';

const menuData = {
  Espresso: [
    { name: 'Espresso', price: 12, description: 'Shot dublu de espresso intens', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop' },
    { name: 'Americano', price: 14, description: 'Espresso diluat cu apă caldă', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop' },
    { name: 'Cappuccino', price: 16, description: 'Espresso cu lapte spumat', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop' },
    { name: 'Flat White', price: 17, description: 'Microfoam mătăsos peste espresso', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop' },
    { name: 'Latte', price: 17, description: 'Espresso cu lapte abundant', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop' },
    { name: 'Macchiato', price: 15, description: 'Espresso cu o notă de lapte spumat', image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600&auto=format&fit=crop' },
  ],
  Specialty: [
    { name: 'Matcha Latte', price: 19, description: 'Ceai matcha japonez cu lapte', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Matcha Fusion', price: 21, description: 'Shot de espresso peste matcha rece', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Chai Latte', price: 18, description: 'Amestec de condimente cu lapte cald', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&auto=format&fit=crop' },
    { name: 'Turmeric Latte', price: 18, description: 'Lapte auriu cu turmeric și condimente', image: 'https://images.unsplash.com/photo-1594671586855-eda12bfeb36f?w=600&auto=format&fit=crop' },
    { name: 'Rose Latte', price: 20, description: 'Lapte cu sirop de trandafiri și vanilie', image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=600&auto=format&fit=crop' },
    { name: 'Hazelnut Latte', price: 19, description: 'Espresso cu sirop de alune și lapte cald', image: 'https://images.unsplash.com/photo-1563390322125-8fd994e3598b?w=600&auto=format&fit=crop' },
  ],
  'Cold Brew': [
    { name: 'Cold Brew Classic', price: 18, description: 'Cafea extrasă la rece 24h', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop' },
    { name: 'Cold Brew Tonic', price: 20, description: 'Cold brew peste apă tonică', image: 'https://images.unsplash.com/photo-1760304737368-7d8376bde94c?w=600&auto=format&fit=crop' },
    { name: 'Cold Brew Orange', price: 19, description: 'Cold brew cu coajă de portocală și sirop natural', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop' },
    { name: 'Cold Brew Caramel', price: 20, description: 'Cold brew cu sos de caramel sărat și gheață', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop' },
    { name: 'Cold Brew Cocos', price: 21, description: 'Cold brew cu lapte de cocos', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop' },
    { name: 'Iced Americano', price: 15, description: 'Americano rece cu gheață', image: 'https://images.unsplash.com/photo-1765690835487-8da60d318d0f?w=600&auto=format&fit=crop' },
  ],
  Patiserie: [
    { name: 'Croissant', price: 12, description: 'Croissant franțuzesc cu unt', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop' },
    { name: 'Croissant Ciocolată', price: 14, description: 'Umplut cu ciocolată belgiană', image: 'https://images.unsplash.com/photo-1718897266472-5b7229ebdd3d?w=600&auto=format&fit=crop' },
    { name: 'Cheesecake', price: 18, description: 'Cremos cu fructe de pădure', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&auto=format&fit=crop' },
    { name: 'Brownie', price: 14, description: 'Brownie cu ciocolată neagră 70%', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop' },
    { name: 'Tartă Lămâie', price: 16, description: 'Cremă de lămâie cu bezea', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop' },
    { name: 'Tiramisu', price: 17, description: 'Rețetă clasică italiană', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop' },
  ],
};

type Category = keyof typeof menuData;
const categories = Object.keys(menuData) as Category[];

export default function MenuStarter() {
  const [activeTab, setActiveTab] = useState<Category>('Espresso');
  const [fadeKey, setFadeKey] = useState(0);

  const handleTabChange = (category: Category) => {
    setActiveTab(category);
    setFadeKey(prev => prev + 1);
  };

  return (
    <section id="meniu" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* TITLU SECȚIUNE */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Meniul nostru
          </h2>
          <p className="text-lg text-gray-500">
            Preparate cu pasiune, servite cu zâmbet
          </p>
        </div>

        {/* TAB-URI CATEGORII */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === category
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* GRID PRODUSE cu fade-in la switch */}
        <div
          key={fadeKey}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ animation: 'fadeIn 0.35s ease-out' }}
        >
          {menuData[activeTab].map((produs) => (
            <div
              key={produs.name}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {/* IMAGINE 4:3 */}
              <div className="aspect-[4/3] overflow-hidden rounded-xl m-3">
                <img
                  src={produs.image}
                  alt={produs.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* TEXT */}
              <div className="px-5 pb-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {produs.name}
                  </h3>
                  <span className="text-amber-600 font-bold whitespace-nowrap ml-2">
                    {produs.price} RON
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {produs.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
}
