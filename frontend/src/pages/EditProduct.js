import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => alert("Failed to load product"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, form);
      alert("Product updated successfully");
      navigate("/products");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          <div className="grid grid-cols-2 gap-4 mb-6">

            <input
              className="p-3 border rounded-lg"
              name="productName"
              value={form.productName || ""}
              onChange={handleChange}
            />

            <input
              className="p-3 border rounded-lg"
              name="brand"
              value={form.brand || ""}
              onChange={handleChange}
            />

            <input
              className="p-3 border rounded-lg"
              name="category"
              value={form.category || ""}
              onChange={handleChange}
            />

            <input
              type="number"
              className="p-3 border rounded-lg"
              name="sellingPrice"
              value={form.sellingPrice || ""}
              onChange={handleChange}
            />

            <input
              type="number"
              className="p-3 border rounded-lg"
              name="currentStock"
              value={form.currentStock || ""}
              onChange={handleChange}
            />

          </div>

          <button className="bg-primary px-6 py-2 rounded-lg">
            Update Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
