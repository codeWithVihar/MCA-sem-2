import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const StaffManage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff"
  });

  const loadUsers = () => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => alert("Failed to load users"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users", form);
      alert("Staff created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Staff"
      });
      loadUsers();
    } catch {
      alert("Creation failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">
        Staff Management
      </h2>

      {/* Create Staff Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-3xl">
        <h3 className="text-lg font-semibold mb-4">
          Create New Staff
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <input
            className="p-3 border rounded-lg"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="p-3 border rounded-lg"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="p-3 border rounded-lg"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            className="p-3 border rounded-lg"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            type="submit"
            className="col-span-2 bg-primary px-6 py-3 rounded-lg hover:bg-secondary transition"
          >
            Create Staff
          </button>
        </form>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead className="bg-primary">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">
                  {u.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
};

export default StaffManage;
