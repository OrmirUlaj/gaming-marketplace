import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "../Common/Button";

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
  price: number;
  imageUrl?: string;
}

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getCart() {
      try {        if (session && session.user && session.user.id) {
          const res = await fetch(`/api/cart?userId=${session.user.id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch cart");
          }          const data = await res.json();
          setCart(data);

          if (data?.items?.length) {
            const productsRes = await fetch(`/api/products`);            const allProducts: Product[] = await productsRes.json();
            const productMap: Record<string, Product> = {};
            allProducts.forEach((p) => {
              // Handle both _id (from MongoDB) and id fields
              const productId = (p as unknown as { _id?: string })._id?.toString() || p.id;
              if (productId) {
                productMap[productId] = p;
              }            });
            setProducts(productMap);
          }
        }      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }    }
    getCart();
  }, [session]);

  const updateQuantity = async (gameId: string, newQuantity: number) => {
    if (!session?.user?.id) {
      setError("Please log in to modify cart");
      return;
    }
    
    setLoading(true);
    setError("");    try {
      // Update the cart by posting the new quantity
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          gameId,
          quantity: newQuantity
        })      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to update cart');
      }
      
      // Update local state
      setCart(prev => {
        if (!prev) return prev;
        const updatedCart = {
          ...prev,
          items: prev.items.map(item => 
            item.gameId === gameId 
              ? { ...item, quantity: newQuantity }
              : item          )
        };
        return updatedCart;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };const removeItem = async (gameId: string) => {
    if (!session?.user?.id) {
      setError("Please log in to modify cart");
      return;
    }
    
    setLoading(true);
    setError("");    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          gameId
        })      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to remove item');
      }
      
      // Update local state
      setCart(prev => {
        if (!prev) return prev;
        const updatedCart = {
          ...prev,          items: prev.items.filter(item => item.gameId !== gameId)
        };
        return updatedCart;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };
  // Filter cart items by game title
  const filteredItems = useMemo(() => {
    if (!cart || !cart.items) return [];
    return cart.items.filter((item) => {
      const product = products[item.gameId];
      const title = product?.title || "";
      return title.toLowerCase().includes(search.toLowerCase());
    });
  }, [cart, products, search]);
  // Calculate total price
  const totalPrice = useMemo(() => {
    return filteredItems.reduce((total, item) => {
      const product = products[item.gameId];
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  }, [filteredItems, products]);
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-8">
        <div className="bg-white/10 rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">Please log in to see your cart</h2>
          <Button 
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
          🛒 Shopping Cart
        </h1>
        
        <div className="bg-white/10 rounded-xl shadow-lg p-6 backdrop-blur-sm">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search cart items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!cart || !filteredItems.length ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl text-gray-300 mb-6">Your cart is empty</p>
              <Button 
                onClick={() => router.push("/products")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">                {filteredItems.map((item, index) => {
                  const product = products[item.gameId];
                  return (
                    <div key={`${item.gameId}-${index}`} className="bg-white/5 rounded-lg p-4 border border-white/20 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Product Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {product?.imageUrl && (
                            <div className="relative w-16 h-16">
                              <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                style={{ objectFit: "contain" }}
                                className="rounded-lg bg-white/20"
                              />
                            </div>
                          )}                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-white">
                              {product ? product.title : `Product ${item.gameId}`}
                            </h3>
                            {product ? (
                              <p className="text-gray-300">${product.price.toFixed(2)} each</p>
                            ) : (
                              <p className="text-red-300">Product details unavailable</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.gameId, Math.max(1, item.quantity - 1))}
                              disabled={loading || item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              −
                            </button>
                            <span className="mx-3 min-w-[2rem] text-center text-white font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.gameId, item.quantity + 1)}
                              disabled={loading}
                              className="w-8 h-8 flex items-center justify-center bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total & Remove */}
                          <div className="flex items-center gap-4">
                            {product && (
                              <div className="text-right">
                                <p className="font-semibold text-white text-lg">
                                  ${(product.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            )}
                            <button
                              onClick={() => removeItem(item.gameId)}
                              disabled={loading}
                              className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-500/20 transition-colors"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-white">
                    Total: ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => router.push("/products")} 
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
