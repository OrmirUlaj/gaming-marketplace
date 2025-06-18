import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

// Navigation links that are always visible
const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Navigation links only visible when NOT logged in
const guestNavLinks = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Register" },
];

// Navigation links only visible when logged in
const authenticatedNavLinks = [
  { href: "/cart", label: "Cart" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Combine navigation links based on authentication status
  const getNavLinks = () => {
    if (session) {
      return [...publicNavLinks, ...authenticatedNavLinks];
    } else {
      return [...publicNavLinks, ...guestNavLinks];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="w-full bg-gradient-to-r from-cyan-700 via-teal-700 to-blue-900 shadow px-2 sm:px-4 md:px-8">
      <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between h-16">
        <div className="flex items-center gap-2 font-bold text-2xl text-white">
          <span className="text-3xl">🎮</span>
          <span className="hidden sm:inline">Stoom</span>
        </div>        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-white/20 px-3 py-1 rounded transition font-medium text-white"
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/30">
              <span className="text-white/90 text-sm">
                Welcome, {session.user?.name || session.user?.email || 'User'}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sign out"
                className="flex items-center gap-1 px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/30 transition text-red-200 hover:text-red-100"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
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
      </nav>      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-purple-700 to-pink-500">
          <div className="flex flex-col gap-4 px-6 pb-4 pt-2">
            {session && (
              <div className="text-white/90 text-sm border-b border-white/20 pb-2">
                Welcome, {session.user?.name || session.user?.email || 'User'}
              </div>
            )}
            <ul className="flex flex-wrap gap-2 sm:gap-4 text-sm sm:text-base">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:bg-white/20 px-3 py-2 rounded text-lg font-medium block"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {session && (
                <li>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-red-600/20 hover:bg-red-600/30 transition text-red-200 hover:text-red-100 text-lg font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}