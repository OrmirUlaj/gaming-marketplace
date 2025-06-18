import { GetStaticPaths, GetStaticProps } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  // Add other fields as needed
}

export default function ProductDetails({ product }: { product: Product | null }) {
  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="mb-2 text-lg text-gray-700">{product.description}</p>
      <p className="mb-2 text-xl font-semibold">${product.price.toFixed(2)}</p>
      {product.category && (
        <p className="mb-2 text-gray-500">Category: {product.category}</p>
      )}
      {/* Add more product details as needed */}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const products = await db.collection("games").find({}, { projection: { _id: 1 } }).toArray();

  const paths = products.map((product: { _id: ObjectId }) => ({
    params: { id: product._id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const product = await db
      .collection("games")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return { notFound: true };
    }

    // Convert _id to string for serialization
    const productWithStringId = {
      ...product,
      _id: product._id.toString(),
    };

    return {
      props: { product: productWithStringId },
      revalidate: 60, // ISR: revalidate every 60 seconds
    };
  } catch (error) {
    return { props: { product: null } };
  }
};