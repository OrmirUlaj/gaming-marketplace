import Image from "next/image";
import { Product } from "@/types/models/Product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col">
      {product.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-xl"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-2">{product.title}</h2>
        <p className="text-gray-300 mb-4 flex-1">{product.description}</p>
        <p className="font-bold text-lg text-white mb-4">${product.price.toFixed(2)}</p>
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