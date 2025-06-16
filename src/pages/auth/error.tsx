import { useRouter } from "next/router";

export default function AuthErrorPage() {
  const { query } = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Authentication Error</h1>
      <p className="text-white mb-8">
        {query.error ? `Error: ${query.error}` : "An unknown error occurred."}
      </p>
      <a href="/auth/login" className="text-cyan-400 underline">Back to Login</a>
    </main>
  );
}