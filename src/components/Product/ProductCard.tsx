import Image from "next/image";
import { Product } from "@/types/models/Product";

export default function ProductCard({ product }: { product: Product }) {
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
          className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white py-2 px-4 rounded font-semibold shadow hover:brightness-110 transition"
          onClick={() => alert(`Added "${product.title}" to cart!`)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}