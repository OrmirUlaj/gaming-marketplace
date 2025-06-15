// pages/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import clientPromise from '../lib/mongodb';
import ProductList from '@/components/Product/ProductList';
import { Product } from '@/types/models/Product';
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{ products: Product[] }> = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const docs = await db
    .collection('games')
    .find({})
    .sort({ title: 1 })
    .toArray();

  const products: Product[] = docs.map((doc: any) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category || 'PC',
    imageUrl: doc.imageUrl,
    rating: doc.rating ?? 0,
    stock: doc.stock ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  }));

  return { props: { products } };
};

const Marketplace: NextPage<{ products: Product[] }> = ({ products }) => (
  <main className="container mx-auto py-16 min-h-screen">
    <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow">🎮 Gaming Marketplace</h1>
    {products.length === 0 ? (
      <p className="text-gray-300 text-center">No games available right now—try adding some in MongoDB Compass!</p>
    ) : (
      <ProductList products={products} />
    )}
  </main>
);

export default function HomePage() {
  return (
    <main className="container mx-auto py-20 min-h-screen flex flex-col items-center justify-center">
      <section className="text-center mb-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">
          Welcome to <span className="text-cyan-400">Stoom</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover, buy, and sell the best games and gaming accessories. Join the Stoom community and level up your gaming experience!
        </p>
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:brightness-110 transition"
        >
          Browse Products
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl w-full px-2 sm:px-4 md:px-8">
        <div className="bg-white/10 rounded-xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl mb-2">🛒</span>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Huge Selection</h2>
          <p className="text-gray-300 text-center text-sm sm:text-base">Find games and accessories for every platform and taste.</p>
        </div>
        <div className="bg-white/10 rounded-xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl mb-2">⚡</span>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Fast & Secure</h2>
          <p className="text-gray-300 text-center text-sm sm:text-base">Enjoy quick checkout and secure payments every time.</p>
        </div>
        <div className="bg-white/10 rounded-xl p-6 shadow flex flex-col items-center">
          <span className="text-4xl mb-2">🌟</span>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Community Driven</h2>
          <p className="text-gray-300 text-center text-sm sm:text-base">Join a passionate community of gamers and sellers on Stoom.</p>
        </div>
        {/* Optionally add a 4th card for balance on xl screens */}
      </section>
    </main>
  );
}
