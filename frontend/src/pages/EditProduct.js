import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    productName: "", brand: "", category: "", sku: "", unit: "Piece",
    purchasePrice: "", sellingPrice: "", gstPercent: 0, discountPercent: 0,
    minStockLevel: 5, currentStock: 0, returnable: true, damageProne: false, hazardous: false,
  });

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          productName: p.productName ?? "", brand: p.brand ?? "", category: p.category ?? "",
          sku: p.sku ?? "", unit: p.unit ?? "Piece", purchasePrice: p.purchasePrice ?? "",
          sellingPrice: p.sellingPrice ?? "", gstPercent: p.gstPercent ?? 0,
          discountPercent: p.discountPercent ?? 0, minStockLevel: p.minStockLevel ?? 5,
          currentStock: p.currentStock ?? 0, returnable: p.returnable ?? true,
          damageProne: p.damageProne ?? false, hazardous: p.hazardous ?? false,
        });
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setForm({ ...form, [name]: type === "checkbox" ? checked : parsedValue });
  };

  const validate = () => {
    const errs = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    if (!form.purchasePrice || form.purchasePrice <= 0) errs.purchasePrice = "Valid purchase price required";
    if (!form.sellingPrice || form.sellingPrice <= 0) errs.sellingPrice = "Valid selling price required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);
      await API.put(`/products/${id}`, data);
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const inputClass = "w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <p className="text-sm text-gray-400 mt-1">Update product information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card space-y-8">
          {/* Basic */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Product Name</label>
                <input name="productName" value={form.productName} onChange={handleChange} className={`${inputClass} ${errors.productName ? 'border-red-300 focus:ring-red-400' : ''}`} />
                {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName}</p>}
              </div>
              <div><label className={labelClass}>Brand</label><input name="brand" value={form.brand} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Category</label><input name="category" value={form.category} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>SKU</label><input name="sku" value={form.sku} onChange={handleChange} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}><option>Piece</option><option>Box</option><option>Kg</option></select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs">2</span>
              Pricing & Stock
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Purchase Price (₹)</label>
                <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleChange} className={`${inputClass} ${errors.purchasePrice ? 'border-red-300 focus:ring-red-400' : ''}`} />
                {errors.purchasePrice && <p className="text-xs text-red-500 mt-1">{errors.purchasePrice}</p>}
              </div>
              <div>
                <label className={labelClass}>Selling Price (₹)</label>
                <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className={`${inputClass} ${errors.sellingPrice ? 'border-red-300 focus:ring-red-400' : ''}`} />
                {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice}</p>}
              </div>
              <div><label className={labelClass}>GST %</label><input type="number" name="gstPercent" value={form.gstPercent} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Discount %</label><input type="number" name="discountPercent" value={form.discountPercent} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Min Stock</label><input type="number" name="minStockLevel" value={form.minStockLevel} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Current Stock</label><input type="number" name="currentStock" value={form.currentStock} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className={labelClass}>Product Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full p-3 border border-gray-200 border-dashed rounded-xl text-sm bg-gray-50" />
          </div>

          {/* Flags */}
          <div className="flex gap-8">
            {[
              { name: "returnable", label: "Returnable", checked: form.returnable },
              { name: "damageProne", label: "Damage Prone", checked: form.damageProne },
              { name: "hazardous", label: "Hazardous", checked: form.hazardous },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={flag.name} checked={flag.checked} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-primary" />
                <span className="text-sm text-gray-600">{flag.label}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium">
            Update Product
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;