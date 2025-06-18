// pages/index.tsx

import { GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";
import { Product } from "@/types/models/Product";
import { WithId } from "mongodb";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  products: Product[];
}> = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const docs: WithId<Product>[] = await db
    .collection<Product>("games")
    .find({})
    .sort({ title: 1 })
    .toArray();

  const products: Product[] = docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category || "PC",
    imageUrl: doc.imageUrl,
    rating: doc.rating ?? 0,
    stock: doc.stock ?? 0,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : new Date().toISOString(),
  }));

  return { props: { products } };
};


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to <span className="text-cyan-400">Stoom</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover, buy, and sell the best games and gaming accessories. Join
            the Stoom community and level up your gaming experience!
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            🎮 Browse Games
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="bg-cyan-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">
              Huge Selection
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Find games and accessories for every platform and taste. From indie gems to AAA blockbusters.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="bg-green-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">
              Fast & Secure
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Enjoy quick checkout and secure payments every time. Your gaming experience starts instantly.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🌟</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">
              Community Driven
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Join a passionate community of gamers and sellers on Stoom. Share, discover, and connect.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
