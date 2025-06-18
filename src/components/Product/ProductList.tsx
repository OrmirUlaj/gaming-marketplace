import ProductCard from './ProductCard';
import { Product } from "@/types/models/Product";
import Link from "next/link";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="block hover:shadow-2xl transition"
          tabIndex={0}
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  );
}