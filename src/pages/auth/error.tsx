import { useRouter } from "next/router";
import Link from "next/link";

export default function AuthErrorPage() {
  const { query } = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20 text-center">
          <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Authentication Error
          </h1>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            {query.error ? `Error: ${query.error}` : "An unknown authentication error occurred. Please try again."}
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              Back to Login
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-semibold border border-white/30 hover:border-white/50 transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}