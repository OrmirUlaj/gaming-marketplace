import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("credentials", { callbackUrl: "/auth/login" });
    }
    if (session) {
      setName(session.user?.name || "");
      setEmail(session.user?.email || "");
    }
  }, [status, session]);

  const handleSave = async () => {
    const body: any = { name, email };
    if (password) body.password = password;
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMessage("Profile updated!");
      setEdit(false);
      setPassword("");
    } else {
      setMessage("Failed to update profile.");
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">
          Profile
        </h1>
        {message && (
          <div className="text-center text-green-400 mb-2">{message}</div>
        )}
        {edit ? (
          <div className="text-gray-200 text-center">
            <label>
              Name:{" "}
              <input
                className="text-black px-2 py-1 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Email:{" "}
              <input
                className="text-black px-2 py-1 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              New Password:{" "}
              <input
                className="text-black px-2 py-1 rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </label>
            <br />
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-md"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md shadow-md"
              onClick={() => {
                setEdit(false);
                setPassword("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-gray-200 text-center">
            Name: {session.user?.name}
            <br />
            Email: {session.user?.email}
          </p>
        )}
        {!edit && (
          <div className="mt-4 text-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
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
