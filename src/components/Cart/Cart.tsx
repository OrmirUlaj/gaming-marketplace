import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  gameId: string;
  quantity: number;
}

interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

interface Product {
  _id: string;
  id?: string;
  title: string;
}

export default function Cart() {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCart() {
      try {
        if (session && session.user && session.user.id) {
          const res = await fetch(`/api/cart?userId=${session.user.id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch cart");
          }
          const data = await res.json();
          setCart(data);

          if (data?.items?.length) {
            const ids = data.items.map((item: CartItem) => item.gameId);
            const productsRes = await fetch(`/api/products`);
            const allProducts: Product[] = await productsRes.json();
            const productMap: Record<string, Product> = {};
            allProducts.forEach((p) => {
              productMap[p._id?.toString()] = p;
            });
            setProducts(productMap);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
    getCart();
  }, [session]);

  if (!session) return <div>Please log in to see your cart.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl mb-4">Shopping Cart</h2>
      {error && <div className="text-red-500">{error}</div>}
      {!cart || !cart.items?.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>
                Game:{" "}
                {products[item.gameId?.toString()]
                  ? products[item.gameId?.toString()].title
                  : item.gameId}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
