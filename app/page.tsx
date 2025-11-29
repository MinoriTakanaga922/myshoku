'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('restaurants').select('*');
      if (data) setRestaurants(data);
    };
    getData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 mt-8">
        MYSHOKU お店リスト
      </h1>
      
      <div className="grid gap-6 w-full max-w-md">
        {restaurants.map((shop) => (
          <div key={shop.id} className="bg-white rounded-xl shadow-lg overflow-hidden text-black">
            {/* ここが画像表示エリア！ */}
            {shop.image_url ? (
              <img 
                src={shop.image_url} 
                alt={shop.name} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{shop.name}</h2>
              <p className="text-gray-600">{shop.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}