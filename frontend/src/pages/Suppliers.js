import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const Suppliers = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const [editingId, setEditingId] = useState(null);

  const loadSuppliers = async () => {

    try {

        const res = await API.get("/suppliers");

        setSuppliers(res.data.data || []);
    } catch {

      alert("Failed to load suppliers");

    }

  };

  useEffect(() => {

    loadSuppliers();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await API.put(`/suppliers/${editingId}`, form);

      } else {

        await API.post("/suppliers", form);

      }

      setForm({
        name: "",
        phone: "",
        email: "",
        address: ""
      });

      setEditingId(null);

      loadSuppliers();

    } catch {

      alert("Operation failed");

    }

  };

  const handleEdit = (supplier) => {

    setForm(supplier);

    setEditingId(supplier._id);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete supplier?")) return;

    try {

      await API.delete(`/suppliers/${id}`);

      loadSuppliers();

    } catch {

      alert("Delete failed");

    }

  };

  return (

    <Layout>

      <h2 className="text-2xl font-semibold mb-6">
        Supplier Management
      </h2>

      {/* Form */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            name="name"
            placeholder="Supplier Name"
            className="border p-3 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            className="border p-3 rounded"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-3 rounded"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            className="border p-3 rounded"
            value={form.address}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="col-span-2 bg-primary py-3 rounded-lg"
          >
            {editingId ? "Update Supplier" : "Add Supplier"}
          </button>

        </form>

      </div>

      {/* Supplier Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Address</th>
              <th className="p-4">Action</th>

            </tr>

          </thead>

          <tbody>

            {suppliers.map((s) => (

              <tr key={s._id} className="border-b">

                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.address}</td>

                <td className="p-4 space-x-3">

                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Layout>

  );

};

export default Suppliers;