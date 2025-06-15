import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  userId: string;
  products: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (session && session.user && session.user.id) {
          const res = await fetch(`/api/orders`);
          if (!res.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await res.json();
          setOrders(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
    fetchOrders();
  }, [session]);

  if (!session) return <div>Please log in to view your orders.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Your Orders</h1>
      {error && <div className="text-red-500">{error}</div>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-2">
            <p>Order ID: {order._id}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <p>
              Created At: {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
            {/* You can add more details like products list here */}
          </div>
        ))
      )}
    </div>
  );
}
