import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 text-gray-200 py-6 mt-8 border-t border-gray-800 shadow-inner">
      <div className="container mx-auto text-center flex flex-col items-center gap-1">
        <div className="font-semibold text-base tracking-wide">
          &copy; {new Date().getFullYear()} Gaming Marketplace
        </div>
        <div className="text-xs text-gray-400">
          Crafted with <span className="text-pink-500">♥</span> by team Pablo.
        </div>
      </div>
    </footer>
  );
}