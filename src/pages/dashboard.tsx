import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Redirect to login
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null; // Or a fallback

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">
          Dashboard
        </h1>
        <p className="text-gray-200 text-center">
          Welcome to your dashboard! (User info and stats will go here.)
        </p>
        <div className="mt-4 text-center">
          <button
            className="text-blue-400 hover:underline"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
