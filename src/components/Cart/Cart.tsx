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

export default function Cart() {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
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
              <p>Game ID: {item.gameId}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
