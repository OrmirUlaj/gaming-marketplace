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
    <section className="container mx-auto py-8 px-2 sm:px-4 md:px-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
        Products
      </h1>
      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={handleSearchChange}
          className="input"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="input"
        >
          <option value="">All Categories</option>
          <option value="Action">Action</option>
          <option value="RPG">RPG</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="input"
        />
      </form>
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No games found matching your search.
        </div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </section>
  );
}
