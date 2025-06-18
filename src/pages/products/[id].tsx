import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export default function ProductDetails({ product }: { product: Product | null }) {
  const { data: session } = useSession();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addToCart = async () => {
    if (!session?.user?.id) {
      setMessage({ type: 'error', text: 'Please log in to add items to cart' });
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product?._id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Added to cart successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add to cart' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding to cart' });
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20 max-w-md mx-auto">
            <span className="text-6xl block mb-4">😞</span>
            <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              Browse All Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          ← Back to Games
        </Link>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            {product.imageUrl ? (
              <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🎮</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.title}
              </h1>
              {product.category && (
                <span className="inline-block bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold border border-cyan-500/30">
                  {product.category}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-600"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-gray-300">({product.rating}/5)</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <p className="text-3xl font-bold text-white">
                ${product.price.toFixed(2)}
              </p>
              {product.stock !== undefined && (
                <p className="text-gray-300 mt-2">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">About This Game</h2>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
                    : 'bg-red-500/20 border border-red-500/50 text-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={addToCart}
                disabled={isAddingToCart || (product.stock !== undefined && product.stock <= 0)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Adding to Cart...' : 
                 (product.stock !== undefined && product.stock <= 0) ? 'Out of Stock' : 
                 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="block w-full bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-lg font-semibold text-lg text-center border border-white/30 hover:border-white/50 transition-all"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
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