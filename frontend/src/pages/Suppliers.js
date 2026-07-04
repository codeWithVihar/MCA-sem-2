import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { Building2, Phone, Mail, MapPin, Edit2, Trash2 } from "lucide-react";
import LoadingBox from "../components/ui/LoadingBox";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: ""
  });
  const [editingId, setEditingId] = useState(null);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data.data || []);
    } catch {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/suppliers/${editingId}`, form);
        toast.success("Supplier updated");
      } else {
        await API.post("/suppliers", form);
        toast.success("Supplier added");
      }
      setForm({ name: "", phone: "", email: "", address: "" });
      setEditingId(null);
      loadSuppliers();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      name: supplier.supplierName || supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });
    setEditingId(supplier._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete supplier?")) return;
    try {
      await API.delete(`/suppliers/${id}`);
      toast.success("Supplier deleted");
      loadSuppliers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition";

  if (loading) return <Layout><LoadingBox text="Loading suppliers..." /></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Supplier Management</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your vendor network</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-card mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-primary" />
            {editingId ? "Edit Supplier" : "Add New Supplier"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="name" placeholder="Supplier Name" className={inputClass} value={form.name} onChange={handleChange} required />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="phone" placeholder="Phone" className={inputClass} value={form.phone} onChange={handleChange} />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="email" placeholder="Email" className={inputClass} value={form.email} onChange={handleChange} />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="address" placeholder="Address" className={inputClass} value={form.address} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", phone: "", email: "", address: "" }); }} className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
              )}
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
                {editingId ? "Update Supplier" : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>

        {/* Supplier Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-x-auto overflow-y-auto max-h-[calc(100vh-240px)] relative border border-gray-100">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-indigo-600 text-white shadow-sm">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Address</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-800">{s.supplierName || s.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    <div>{s.phone}</div>
                    <div className="text-gray-400">{s.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{s.address}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-2" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan="4" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Building2 size={28} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No suppliers found</p>
                    <p className="text-xs text-gray-400 mt-1">Add your first supplier to get started</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Suppliers;