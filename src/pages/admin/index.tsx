import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  type User = {
    _id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
    password?: string;
    [key: string]: any;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<User>>({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "user" | "admin">("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const startEdit = (user: User) => {
    setEditId(user._id);
    setEditFields({ ...user });
  };

  const handleEdit = async (id: string) => {
    const { _id, createdAt, updatedAt, ...fields } = editFields;
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, ...fields } : u
      )
    );
    setEditId(null);
  };

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Admin <span className="text-cyan-400">Panel</span>
          </h1>
          <p className="text-xl text-gray-300">
            Manage users and system settings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-blue-500/30 p-3 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Admins</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="bg-purple-500/30 p-3 rounded-lg">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Regular Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
              </div>
              <div className="bg-green-500/30 p-3 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🔍 Filter Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "" | "user" | "admin")}
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
            >
              <option value="" className="bg-slate-800">All Roles</option>
              <option value="user" className="bg-slate-800">Users</option>
              <option value="admin" className="bg-slate-800">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              👥 Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-gray-300 font-semibold">Name</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Email</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Role</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Created</th>
                  <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {editId === u._id ? (
                        <input
                          type="text"
                          value={editFields.name || ""}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:border-cyan-400 focus:outline-none"
                        />
                      ) : (
                        <span className="text-white font-medium">{u.name}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editId === u._id ? (
                        <input
                          type="email"
                          value={editFields.email || ""}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:border-cyan-400 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-300">{u.email}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editId === u._id ? (
                        <select
                          value={editFields.role || ""}
                          onChange={(e) =>
                            setEditFields((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                          className="px-3 py-2 bg-white/20 text-white rounded border border-white/30 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="user" className="bg-slate-800">User</option>
                          <option value="admin" className="bg-slate-800">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      {editId === u._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(u._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(u)}
                            className="px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}