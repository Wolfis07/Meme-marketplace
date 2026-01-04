import { useFetch } from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { enrichMeme, CATEGORIES, Meme } from '../utils/memeUtils';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <div className={`p-6 rounded-xl shadow-md text-white ${color}`}>
    <h3 className="text-lg font-semibold opacity-80">{title}</h3>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

interface ApiResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

export const Dashboard = () => {
  const { data, loading } = useFetch<ApiResponse>('https://api.imgflip.com/get_memes');
  const { getCartCount } = useCart();

  const stats = useMemo(() => {
    if (!data) return null;
    const allMemes = data.data.memes.map(enrichMeme);
    const topMeme = [...allMemes].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    
    return {
      count: allMemes.length,
      categories: CATEGORIES.length,
      topMeme
    };
  }, [data]);

  if (loading) return <div className="text-center mt-10">Načítám dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Počet Meme" value={stats?.count || 0} color="bg-blue-500" />
        <StatCard title="Kategorie" value={stats?.categories || 0} color="bg-purple-500" />
        <StatCard title="V košíku" value={getCartCount()} color="bg-green-500" />
        <StatCard title="Top Rating" value="5.0 ⭐" color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">🔥 Nejoblíbenější Meme</h2>
          {stats?.topMeme && (
            <div className="flex gap-4 items-center">
              <img src={stats.topMeme.url} alt="Top" className="w-32 h-32 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{stats.topMeme.name}</h3>
                <p className="text-yellow-500">Rating: {stats.topMeme.rating} ⭐</p>
                <p className="text-gray-500">Kategorie: {stats.topMeme.category}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl shadow-inner flex flex-col justify-center items-center text-center">
          <h2 className="text-xl font-bold mb-2">Prozkoumej Market</h2>
          <p className="mb-6 text-gray-600">Máme stovky nových meme připravených pro tebe.</p>
          <Link to="/memes" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            Přejít na Memy
          </Link>
        </div>
      </div>
    </div>
  );
};