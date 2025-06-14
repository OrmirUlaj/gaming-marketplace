export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">Your Cart</h1>
        <p className="text-gray-200 text-center">Your cart is empty. Start adding some games!</p>
      </div>
    </div>
  );
}