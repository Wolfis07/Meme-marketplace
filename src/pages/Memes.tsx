import { useState, useMemo, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { enrichMeme, CATEGORIES, Meme } from '../utils/memeUtils';
import { Link } from 'react-router-dom';

interface ApiResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

export const Memes = () => {
  const { data, loading, error } = useFetch<ApiResponse>('https://api.imgflip.com/get_memes');
  const { addItem } = useCart();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('name'); 

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const processedMemes = useMemo(() => {
    if (!data) return [];
    
    let memes = data.data.memes.map(enrichMeme);

    if (category !== 'All') {
      memes = memes.filter(m => m.category === category);
    }

    if (debouncedSearch) {
      memes = memes.filter(m => m.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }

    memes.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'size') return (b.width * b.height) - (a.width * a.height);
      return 0;
    });

    return memes;
  }, [data, category, debouncedSearch, sort]);

  if (error) return <div className="text-red-500 text-center text-xl mt-10">Nepodařilo se načíst memy 😢</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meme Marketplace</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <input
          type="text"
          placeholder="Hledat meme..."
          className="border p-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <button
            onClick={() => setCategory('All')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
              category === 'All' 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                category === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select 
          className="border p-2 rounded-md w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name">Název A-Z</option>
          <option value="rating">Hodnocení (Nejvyšší)</option>
          <option value="size">Velikost (Největší)</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-80 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedMemes.map(meme => (
            <div key={meme.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-100 relative group">
                <img 
                  src={meme.url} 
                  alt={meme.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg truncate mb-1" title={meme.name}>{meme.name}</h3>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                   <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{meme.category}</span>
                   <span className="text-yellow-500 font-bold flex items-center gap-1">
                     {meme.rating} ⭐
                   </span>
                </div>

                <div className="mt-auto pt-2 flex gap-2">
                  <Link 
                    to={`/memes/${meme.id}`} 
                    className="flex-1 text-center border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex items-center justify-center"
                  >
                    Detail
                  </Link>
                  <button 
                    onClick={() => addItem(meme)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm active:transform active:scale-95"
                  >
                    Do košíku
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};