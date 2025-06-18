import { GetServerSideProps } from "next";
import clientPromise from "@/lib/mongodb";
import ProductList from "@/components/Product/ProductList";
import ProductCard from "@/components/Product/ProductCard";
import type { Product } from "@/types/models/Product";
import type { WithId } from "mongodb";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";


interface MongoProduct {
  title: string;
  description: string;
  price: number;
  category?: string;
  imageUrl: string;
  rating?: number;
  stock?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);


  const docs: WithId<MongoProduct>[] = await db
    .collection<MongoProduct>("games")
    .find({})
    .sort({ title: 1 })
    .toArray();


  const products: Product[] = docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: (doc.category as "PC" | "Console" | "Mobile") || "PC",
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

export default function ProductsPage({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Debounced fetch function
  const fetchProducts = useCallback(
    debounce(
      async (searchVal: string, categoryVal: string, minVal: string, maxVal: string) => {
        const params = new URLSearchParams();
        if (searchVal) params.append("search", searchVal);
        if (categoryVal) params.append("category", categoryVal);
        if (minVal) params.append("minPrice", minVal);
        if (maxVal) params.append("maxPrice", maxVal);

        const res = await fetch(`/api/products?${params.toString()}`);
        setFilteredProducts(await res.json());
      },
      400
    ),
    []
  );


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchProducts(e.target.value, category, minPrice, maxPrice);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    fetchProducts(search, e.target.value, minPrice, maxPrice);
  };
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
    fetchProducts(search, category, e.target.value, maxPrice);
  };
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
    fetchProducts(search, category, minPrice, e.target.value);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Browse <span className="text-cyan-400">Games</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover your next favorite game from our extensive collection
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🔍 Filter Games
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            />
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            >
              <option value="" className="bg-slate-800">All Categories</option>
              <option value="Action" className="bg-slate-800">Action</option>
              <option value="RPG" className="bg-slate-800">RPG</option>
            </select>
            <input
              type="number"
              placeholder="Min Price ($)"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            />
            <input
              type="number"
              placeholder="Max Price ($)"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            />
          </form>
        </div>

        {/* Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20 max-w-md mx-auto">
              <span className="text-6xl block mb-4">🎮</span>
              <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-300">
                Showing <span className="text-cyan-400 font-semibold">{filteredProducts.length}</span> games
              </p>
            </div>
            <ProductList products={filteredProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
