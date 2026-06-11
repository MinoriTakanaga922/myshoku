'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SearchPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [allergensList, setAllergensList] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchAllergen, setSearchAllergen] = useState('');

  useEffect(() => {
    const getData = async () => {
      const { data: restaurantsData } = await supabase
        .from('restaurants')
        .select(`*, restaurant_allergens(status, allergens(name))`);
      if (restaurantsData) setRestaurants(restaurantsData);

      const { data: allergensData } = await supabase.from('allergens').select('*');
      if (allergensData) setAllergensList(allergensData);
    };
    getData();
  }, []);

  const filtered = restaurants.filter((shop) => {
    const nameMatch = shop.name.includes(searchName);
    let allergenMatch = true;
    if (searchAllergen !== '') {
      const isDangerous = shop.restaurant_allergens.some(
        (ra: any) => ra.allergens?.name === searchAllergen && ra.status === 'NG'
      );
      allergenMatch = !isDangerous;
    }
    return nameMatch && allergenMatch;
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
          ← トップへ
        </Link>
        <span className="text-white font-black text-xl">
          MY<span className="text-orange">SHOKU</span>
        </span>
        <span className="text-white/40 text-sm ml-auto">飲食店を探す</span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <input
            type="text"
            placeholder="店名で検索..."
            className="w-full p-3 border border-navy/10 rounded-xl mb-4 text-navy text-sm focus:outline-none focus:border-orange transition-colors"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <p className="text-xs text-muted mb-2 font-medium">除去したいアレルゲンを選択（NG店を非表示）</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchAllergen('')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                searchAllergen === ''
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-muted border-navy/10 hover:border-navy/30'
              }`}
            >
              すべて
            </button>
            {allergensList.map((allergen) => (
              <button
                key={allergen.id}
                onClick={() => setSearchAllergen(allergen.name)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  searchAllergen === allergen.name
                    ? 'bg-orange text-white border-orange'
                    : 'bg-white text-muted border-navy/10 hover:border-orange/30'
                }`}
              >
                {allergen.name}除去
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-5 pb-20">
          {filtered.length === 0 ? (
            <p className="text-center text-muted py-10">条件に合うお店が見つかりませんでした</p>
          ) : (
            filtered.map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {shop.image_url ? (
                  <img src={shop.image_url} alt={shop.name} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-warm flex items-center justify-center text-muted/40 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-navy mb-1">{shop.name}</h2>
                  <p className="text-sm text-muted mb-4 leading-relaxed">{shop.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.restaurant_allergens?.map((item: any, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          item.status === 'NG'
                            ? 'bg-red-50 text-red-500 border-red-100'
                            : item.status === 'SAFE'
                            ? 'bg-teal-50 text-teal border-teal/10'
                            : 'bg-warm text-muted border-navy/5'
                        }`}
                      >
                        {item.allergens?.name}: {item.status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
