export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded shadow p-4">
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p>{product.description}</p>
      <div className="mt-2 font-semibold text-blue-600">${product.price}</div>
    </div>
  );
}