// pages/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import clientPromise from '../lib/mongodb';

export interface Game {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const getServerSideProps: GetServerSideProps<{ games: Game[] }> = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const docs = await db
    .collection('games')
    .find({})
    .sort({ title: 1 })
    .toArray();

  const games: Game[] = docs.map(doc => ({
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    imageUrl: doc.imageUrl,
  }));

  return { props: { games } };
};

const Marketplace: NextPage<{ games: Game[] }> = ({ games }) => (
  <main className="container mx-auto py-16 min-h-screen">
    <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow">🎮 Gaming Marketplace</h1>
    {games.length === 0 ? (
      <p className="text-gray-300 text-center">No games available right now—try adding some in MongoDB Compass!</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {games.map(game => (
          <div
            key={game._id}
            className="bg-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-48">
              <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-xl"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-2">{game.title}</h2>
              <p className="text-gray-300 mb-4 flex-1">{game.description}</p>
              <p className="font-bold text-lg text-white mb-4">${game.price.toFixed(2)}</p>
              <button
                className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white py-2 px-4 rounded font-semibold shadow hover:brightness-110 transition"
                onClick={() => alert(`Added "${game.title}" to cart!`)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
);

export default Marketplace;
