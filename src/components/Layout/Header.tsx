import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Register" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl text-white"
        >
          <span className="text-3xl drop-shadow-sm">🎮</span>
          <span className="hidden sm:inline drop-shadow">Stoom</span>
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-white/20 px-3 py-1 rounded transition font-medium text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-7 h-1 bg-white mb-1 rounded"></span>
          <span className="block w-7 h-1 bg-white mb-1 rounded"></span>
          <span className="block w-7 h-1 bg-white rounded"></span>
        </button>
      </nav>
      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-purple-700 to-pink-500">
          <div className="flex flex-col gap-4 px-6 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:bg-white/20 px-3 py-2 rounded text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}