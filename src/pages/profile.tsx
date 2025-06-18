import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("credentials", { callbackUrl: "/auth/login" });
    }
    if (session) {
      setName(session.user?.name || "");
      setEmail(session.user?.email || "");
    }
  }, [status, session]);

  const validateForm = () => {
    if (name.trim().length < 2) {
      setMessage("Name must be at least 2 characters");
      setMessageType("error");
      return false;
    }
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setMessage("Invalid email format");
      setMessageType("error");
      return false;
    }
    if (password && password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage("");
    
    const body: any = { name, email };
    if (password) body.password = password;
    
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessageType("success");
        setMessage("Profile updated successfully!");
        setEdit(false);
        setPassword("");
        // Update the session with new user data
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          },
        });
      } else {
        setMessageType("error");
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your profile...</p>
        </div>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your <span className="text-cyan-400">Profile</span>
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20">
          {message && (
            <div className={`${
              messageType === "success" 
                ? "bg-green-500/20 border-green-500/50 text-green-200" 
                : "bg-red-500/20 border-red-500/50 text-red-200"
              } border px-4 py-3 rounded-lg mb-6`}>
              {message}
            </div>
          )}

          {edit ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                ✏️ Edit Profile
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEdit(false);
                    setPassword("");
                    setName(session?.user?.name || "");
                    setEmail(session?.user?.email || "");
                    setMessage("");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                👤 Profile Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-300 text-sm">Name</label>
                  <p className="text-white font-semibold text-lg">{session.user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Email</label>
                  <p className="text-white font-semibold text-lg">{session.user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setEdit(true)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                >
                  Edit Profile
                </button>
                
                {session?.user?.role === "admin" && (
                  <Link href="/admin">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all">
                      Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
