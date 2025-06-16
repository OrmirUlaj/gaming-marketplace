import { useEffect, useState } from "react";

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

  const editableFields = ["email", "name", "role", "password"];

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Users</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search by email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 8, padding: 4 }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "" | "user" | "admin")}
          style={{ padding: 4 }}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {editableFields.map((field) => (
              <th key={field} style={{ border: "1px solid #ccc", padding: "4px" }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </th>
            ))}
            <th style={{ border: "1px solid #ccc", padding: "4px" }}>Created</th>
            <th style={{ border: "1px solid #ccc", padding: "4px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              {editableFields.map((field) => (
                <td key={field} style={{ border: "1px solid #ccc", padding: "4px" }}>
                  {editId === u._id ? (
                    field === "role" ? (
                      <select
                        value={editFields.role || ""}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <input
                        type={field === "password" ? "password" : "text"}
                        value={editFields[field] || ""}
                        onChange={(e) =>
                          setEditFields((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    )
                  ) : field === "password"
                    ? "••••••••"
                    : u[field]}
                </td>
              ))}
              <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                {editId === u._id ? (
                  <>
                    <button onClick={() => handleEdit(u._id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}