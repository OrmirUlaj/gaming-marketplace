import Image from "next/image";
import { Product } from "@/types/models/Product";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleAddToCart = async () => {
    // Ensure the user is logged in before attempting to add product to cart
    if (!session || !session.user?.id) {
      setError("Please log in to add products to your cart.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          gameId: product.id, // assuming your cart expects a gameId that maps to product.id
          quantity: 1, // You can expand this to allow quantity input
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to add product to cart.");
      } else {
        setSuccess("Product added to cart!");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col p-4 h-full min-h-[420px]">
      {product.imageUrl && (
        <div className="relative w-full h-40 sm:h-48 flex items-center justify-center mb-4">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            style={{ objectFit: "contain", padding: "12px" }}
            className="rounded-t-xl bg-white/20"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
          {product.title}
        </h2>
        <p className="text-gray-300 mb-4 flex-1 text-sm sm:text-base">
          {product.description}
        </p>
        <p className="font-bold text-base sm:text-lg text-white mb-4">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}
