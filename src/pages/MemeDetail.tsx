import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { enrichMeme, Meme } from '../utils/memeUtils';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

interface ApiResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

export const MemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data, loading, error } = useFetch<ApiResponse>('https://api.imgflip.com/get_memes');

  const { meme, related } = useMemo(() => {
    if (!data) return { meme: null, related: [] };
    const allMemes = data.data.memes.map(enrichMeme);
    const foundMeme = allMemes.find(m => m.id === id);
    if (!foundMeme) return { meme: null, related: [] };
    const relatedMemes = allMemes.filter(m => m.category === foundMeme.category && m.id !== foundMeme.id).slice(0, 3);
    return { meme: foundMeme, related: relatedMemes };
  }, [data, id]);

  if (loading) return <div className="text-center mt-10">Načítám detail...</div>;
  if (error || !meme) return <div className="text-center mt-10">Meme nenalezeno 😢</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-black">
        <ArrowLeft size={20} /> Zpět
      </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
        <div className="bg-gray-100 flex items-center justify-center p-4">
          <img src={meme.url} alt={meme.name} className="max-w-full max-h-[500px] object-contain rounded-lg" />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full w-fit mb-2">{meme.category}</span>
          <h1 className="text-3xl font-bold mb-4">{meme.name}</h1>
          <p className="text-2xl font-bold text-green-600 mb-6">{meme.price} Kč</p>
          <button onClick={() => addItem(meme)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
            Přidat do košíku
          </button>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Podobné</h2>
        <div className="grid grid-cols-3 gap-6">
          {related.map(r => (
            <Link key={r.id} to={`/memes/${r.id}`} className="bg-white p-3 rounded-lg shadow hover:shadow-md">
               <img src={r.url} alt={r.name} className="w-full h-32 object-cover rounded mb-2" />
               <p className="font-semibold text-xs truncate">{r.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};