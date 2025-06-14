import ProductList from '@/components/Product/ProductList';

const mockProducts = [
  { id: 1, name: "Game 1", description: "Awesome game", price: 59.99 },
  { id: 2, name: "Game 2", description: "Another game", price: 49.99 },
];

export default function ProductsPage() {
  return (
    <section className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductList products={mockProducts} />
    </section>
  );
}