import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("credentials", { callbackUrl: "/auth/login" });
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

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
      </div>
    </div>
  );
}
