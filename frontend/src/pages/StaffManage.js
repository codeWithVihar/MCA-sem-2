import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { UserPlus, Users, Shield, Mail, Key } from "lucide-react";

const StaffManage = () => {
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const PAGE_SIZE = 20;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff"
  });

  const loadUsers = () => {
    API.get("/users")
      .then(res => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load users"));
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
      toast.success("Staff created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "Staff"
      });
      loadUsers();
    } catch {
      toast.error("Creation failed");
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition";
  const visibleUsers = users.slice(0, visibleCount);

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
            <p className="text-sm text-gray-400 mt-1">Manage system access and roles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Staff Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-card sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                Add New Staff
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className={inputClass}
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className={inputClass}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className={inputClass}
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    className={`${inputClass} bg-white appearance-none`}
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium mt-2"
                >
                  Create Staff Account
                </button>
              </form>
            </div>
          </div>

          {/* Staff Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card overflow-x-auto overflow-y-auto max-h-[calc(100vh-240px)] relative border border-gray-100">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-indigo-600 text-white shadow-sm">
                  <tr>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 font-medium text-gray-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.isActive ? (
                          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Users size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No staff found</p>
                        <p className="text-xs text-gray-400 mt-1">Add staff members to manage the system</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {users.length > visibleCount && (
              <div className="text-center py-4 border-t border-gray-100">
                <button
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
                >
                  Show More ({users.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffManage;
