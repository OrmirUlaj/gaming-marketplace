import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  cartItems: number;
  favoriteGames: number;
  accountAge: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    cartItems: 0,
    favoriteGames: 0,
    accountAge: "New User"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Redirect to login
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      // Simulate loading user stats
      const loadStats = async () => {
        try {
          // Get cart items count
          const cartRes = await fetch(`/api/cart?userId=${session.user.id}`);
          const cartData = await cartRes.json();
          const cartItemsCount = cartData?.items?.length || 0;

          // Simulate other stats
          setStats({
            totalOrders: Math.floor(Math.random() * 10) + 1,
            cartItems: cartItemsCount,
            favoriteGames: Math.floor(Math.random() * 15) + 3,
            accountAge: "2 months"
          });
        } catch (error) {
          console.error("Error loading stats:", error);
        } finally {
          setLoading(false);
        }
      };

      loadStats();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="text-cyan-400">{session.user?.name || session.user?.email || 'Gamer'}</span>!
          </h1>
          <p className="text-xl text-gray-300">
            Here's what's happening in your gaming world
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Cart Items</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : stats.cartItems}</p>
              </div>
              <div className="bg-blue-500/30 p-3 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : stats.totalOrders}</p>
              </div>
              <div className="bg-green-500/30 p-3 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Favorite Games</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : stats.favoriteGames}</p>
              </div>
              <div className="bg-purple-500/30 p-3 rounded-lg">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Account Age</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : stats.accountAge}</p>
              </div>
              <div className="bg-orange-500/30 p-3 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🚀 Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/products" 
                className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🎮</span>
                <span className="text-white font-semibold">Browse Games</span>
              </Link>
              
              <Link 
                href="/cart" 
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">🛒</span>
                <span className="text-white font-semibold">View Cart</span>
              </Link>
              
              <Link 
                href="/profile" 
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👤</span>
                <span className="text-white font-semibold">Edit Profile</span>
              </Link>
              
              <Link 
                href="/contact" 
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg p-4 text-center transition-colors group"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💬</span>
                <span className="text-white font-semibold">Contact Us</span>
              </Link>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🎯 Gaming Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎮</span>
                  <div>
                    <p className="text-white font-semibold">Recent Purchase</p>
                    <p className="text-gray-400 text-sm">The Witcher 3: Wild Hunt</p>
                  </div>
                </div>
                <span className="text-green-400 text-sm">2 days ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">❤️</span>
                  <div>
                    <p className="text-white font-semibold">Added to Favorites</p>
                    <p className="text-gray-400 text-sm">Cyberpunk 2077</p>
                  </div>
                </div>
                <span className="text-blue-400 text-sm">1 week ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🛒</span>
                  <div>
                    <p className="text-white font-semibold">Added to Cart</p>
                    <p className="text-gray-400 text-sm">Minecraft</p>
                  </div>
                </div>
                <span className="text-orange-400 text-sm">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            👤 Account Information
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Name</label>
                <p className="text-white font-semibold">{session.user?.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Email</label>
                <p className="text-white font-semibold">{session.user?.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Account Type</label>
                <p className="text-white font-semibold">Standard User</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Member Since</label>
                <p className="text-white font-semibold">November 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
