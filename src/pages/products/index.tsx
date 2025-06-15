import { GetServerSideProps } from "next";
import clientPromise from "@/lib/mongodb";
import ProductList from '@/components/Product/ProductList';
import { Product } from '@/types/models/Product';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const docs = await db.collection("games").find({}).sort({ title: 1 }).toArray();

  const products: Product[] = docs.map((doc: any) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category || "PC",
    imageUrl: doc.imageUrl,
    rating: doc.rating ?? 0,
    stock: doc.stock ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  }));

  return { props: { products } };
};

export default function ProductsPage({ products }: { products: Product[] }) {
  return (
    <section className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6 text-white">Products</h1>
      <ProductList products={products} />
    </section>
  );
}