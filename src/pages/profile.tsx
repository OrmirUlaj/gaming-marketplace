import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("credentials", { callbackUrl: "/auth/login" });
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  console.log("Session:", session);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">
          Profile
        </h1>
        <p className="text-gray-200 text-center">
          Name: {session.user?.name}
          <br />
          Email: {session.user?.email}
        </p>
        {session?.user?.role === "admin" && (
          <div className="mt-4 text-center">
            <Link href="/admin">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md">
                Go to Admin Panel
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
