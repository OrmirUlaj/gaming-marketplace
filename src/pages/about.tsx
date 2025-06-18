import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-cyan-400">Stoom</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A modern gaming marketplace built with cutting-edge web technologies
          </p>
        </div>

        {/* Project Info Card */}
        <div className="bg-white/10 rounded-xl shadow-lg p-8 mb-12 backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            🎮 Project Overview
          </h2>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              Stoom is a comprehensive gaming marketplace that allows users to discover, buy, and explore 
              the best games across all platforms. Built as a modern web application, it features 
              user authentication, dynamic product catalog, shopping cart functionality, and responsive design.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-cyan-400">🛠️ Technologies Used</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Next.js 15 with TypeScript</li>
                  <li>• NextAuth.js for Authentication</li>
                  <li>• MongoDB for Database</li>
                  <li>• Tailwind CSS for Styling</li>
                  <li>• Vitest for Testing</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-cyan-400">✨ Key Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>• User Authentication & Authorization</li>
                  <li>• Dynamic Product Catalog</li>
                  <li>• Shopping Cart System</li>
                  <li>• Admin Panel</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            👥 Development Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ormir */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">OU</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ormir Ulaj</h3>
              <p className="text-cyan-400 font-semibold mb-3">Frontend Developer</p>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• UI/UX Design & Implementation</p>
                <p>• React Components & Pages</p>
                <p>• Cart System & Authentication UI</p>
                <p>• Responsive Design & Testing</p>
              </div>
            </div>

            {/* Eros */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">EZ</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Eros Zhubi</h3>
              <p className="text-purple-400 font-semibold mb-3">Backend Developer</p>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• API Development & Integration</p>
                <p>• Database Design & Management</p>
                <p>• Authentication & Security</p>
                <p>• Admin Panel & User Management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-6 border border-cyan-500/30">
            <h3 className="text-lg font-semibold text-white mb-2">📚 Academic Project</h3>
            <p className="text-gray-300">
              This project was developed as part of the <span className="text-cyan-400 font-semibold">Client-Side Web Development</span> course.
              <br />
              It demonstrates modern web development practices and full-stack application architecture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}