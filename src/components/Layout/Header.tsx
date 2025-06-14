import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          🎮 Gaming Marketplace
        </Link>
        <div className="space-x-6">
          <Link href="/products" className="hover:text-gray-300">Games</Link>
          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/auth/login" className="hover:text-gray-300">Login</Link>
        </div>
      </nav>
    </header>
  );
}