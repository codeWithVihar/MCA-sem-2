import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const CreateProduct = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    sku: "",
    unit: "Piece",
    purchasePrice: 0,
    sellingPrice: 0,
    gstPercent: 0,
    discountPercent: 0,
    minStockLevel: 5,
    status: "Active",
    returnable: true,
    damageProne: false,
    hazardous: false
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/products", form);

      alert("Product created successfully");

      navigate("/products");

    } catch (error) {

      alert("Product creation failed");

    }

  };

  return (

    <Layout>

      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-semibold mb-6">
          Create Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md"
        >

          <div className="grid grid-cols-2 gap-4">

            <input
              name="productName"
              placeholder="Product Name"
              className="p-3 border rounded-lg"
              onChange={handleChange}
              required
            />

            <input
              name="brand"
              placeholder="Brand"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="category"
              placeholder="Category"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="sku"
              placeholder="SKU / Item Code"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="unit"
              placeholder="Unit (Piece, Box, Kg)"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="purchasePrice"
              type="number"
              placeholder="Purchase Price"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="sellingPrice"
              type="number"
              placeholder="Selling Price"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="gstPercent"
              type="number"
              placeholder="GST %"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="discountPercent"
              type="number"
              placeholder="Discount %"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <input
              name="minStockLevel"
              type="number"
              placeholder="Minimum Stock Level"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            />

            <select
              name="status"
              className="p-3 border rounded-lg"
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
            </select>

          </div>

          {/* Flags */}

          <div className="grid grid-cols-3 gap-4 mt-6">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="returnable"
                checked={form.returnable}
                onChange={handleChange}
              />
              Returnable
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="damageProne"
                checked={form.damageProne}
                onChange={handleChange}
              />
              Damage Prone
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hazardous"
                checked={form.hazardous}
                onChange={handleChange}
              />
              Hazardous
            </label>

          </div>

          <button
            type="submit"
            className="mt-6 bg-primary hover:bg-secondary px-6 py-3 rounded-lg"
          >
            Create Product
          </button>

        </form>

      </div>

    </Layout>

  );

};

export default CreateProduct;