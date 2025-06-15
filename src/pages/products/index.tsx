import { GetServerSideProps } from "next";
import clientPromise from "@/lib/mongodb";
import ProductList from "@/components/Product/ProductList";
import ProductCard from "@/components/Product/ProductCard";
import type { Product } from "@/types/models/Product";
import type { WithId } from "mongodb";

// Define a type for documents from your "games" collection.
// This type should match the structure stored in MongoDB.
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

  // Now we use WithId to type the returned documents
  const docs: WithId<MongoProduct>[] = await db
    .collection<MongoProduct>("games")
    .find({})
    .sort({ title: 1 })
    .toArray();

  // Map your MongoProduct to your Product interface
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
  return (
    <section className="container mx-auto py-8 px-2 sm:px-4 md:px-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">
        Products
      </h1>
      <ProductList products={products} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
