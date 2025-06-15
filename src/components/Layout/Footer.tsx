import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-cyan-700 via-teal-700 to-blue-900 px-4 md:px-8 py-4 mt-8">
      <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Stoom. All rights reserved.
      </div>
    </footer>
  );
}