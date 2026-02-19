import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    currentStock: 0,
    minStockLevel: 5,
    purchasePrice: 0,
    sellingPrice: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", form);
      alert("Product added successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Only Admin can add product");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Add New Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          <div className="grid grid-cols-2 gap-4 mb-6">

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="productName"
              placeholder="Product Name"
              onChange={handleChange}
              required
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="brand"
              placeholder="Brand"
              onChange={handleChange}
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="category"
              placeholder="Category"
              onChange={handleChange}
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="currentStock"
              type="number"
              placeholder="Initial Stock"
              onChange={handleChange}
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="minStockLevel"
              type="number"
              placeholder="Min Stock Level"
              onChange={handleChange}
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="purchasePrice"
              type="number"
              placeholder="Purchase Price"
              onChange={handleChange}
            />

            <input
              className="p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
              name="sellingPrice"
              type="number"
              placeholder="Selling Price"
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-secondary px-6 py-3 rounded-lg transition font-medium"
          >
            Add Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProduct;
