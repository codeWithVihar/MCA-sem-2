import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const EditProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    sku: "",
    unit: "Piece",
    purchasePrice: "",
    sellingPrice: "",
    gstPercent: 0,
    discountPercent: 0,
    minStockLevel: 5,
    currentStock: 0,
    returnable: true,
    damageProne: false,
    hazardous: false
  });

  /* ================= LOAD PRODUCT ================= */

  useEffect(() => {

    API.get(`/products/${id}`)
      .then((res) => {

        const p = res.data;

        setForm({
          productName: p.productName || "",
          brand: p.brand || "",
          category: p.category || "",
          sku: p.sku || "",
          unit: p.unit || "Piece",
          purchasePrice: p.purchasePrice || "",
          sellingPrice: p.sellingPrice || "",
          gstPercent: p.gstPercent || 0,
          discountPercent: p.discountPercent || 0,
          minStockLevel: p.minStockLevel || 5,
          currentStock: p.currentStock || 0,
          returnable: p.returnable ?? true,
          damageProne: p.damageProne ?? false,
          hazardous: p.hazardous ?? false
        });

      })
      .catch(() => alert("Failed to load product"));

  }, [id]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };

  /* ================= IMAGE ================= */

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      if (image) {
        data.append("image", image);
      }

      await API.put(`/products/${id}`, data);

      alert("Product updated successfully");

      navigate("/products");

    } catch (error) {
      console.log(error);
      alert("Update failed");
    }

  };

  /* ================= UI ================= */

  return (
    <Layout>

      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-semibold mb-6">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md grid grid-cols-2 gap-4"
        >

          <input name="productName" value={form.productName} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Product Name" />

          <input name="brand" value={form.brand} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Brand" />

          <input name="category" value={form.category} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Category" />

          <input name="sku" value={form.sku} onChange={handleChange} className="p-3 border rounded-lg" placeholder="SKU" />

          <select name="unit" value={form.unit} onChange={handleChange} className="p-3 border rounded-lg">
            <option>Piece</option>
            <option>Box</option>
            <option>Kg</option>
          </select>

          <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Purchase Price" />

          <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Selling Price" />

          <input type="number" name="gstPercent" value={form.gstPercent} onChange={handleChange} className="p-3 border rounded-lg" placeholder="GST %" />

          <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Discount %" />

          <input type="number" name="minStockLevel" value={form.minStockLevel} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Min Stock Level" />

          <input type="number" name="currentStock" value={form.currentStock} onChange={handleChange} className="p-3 border rounded-lg" placeholder="Current Stock" />

          {/* IMAGE */}
          <input
            type="file"
            onChange={handleImage}
            className="col-span-2 p-3 border rounded-lg"
          />

          {/* CHECKBOXES */}
          <div className="col-span-2 flex gap-6">

            <label>
              <input type="checkbox" name="returnable" checked={form.returnable} onChange={handleChange} />
              Returnable
            </label>

            <label>
              <input type="checkbox" name="damageProne" checked={form.damageProne} onChange={handleChange} />
              Damage Prone
            </label>

            <label>
              <input type="checkbox" name="hazardous" checked={form.hazardous} onChange={handleChange} />
              Hazardous
            </label>

          </div>

          <button className="col-span-2 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition">
            Update Product
          </button>

        </form>

      </div>

    </Layout>
  );
};

export default EditProduct;