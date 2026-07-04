import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    productName: "", brand: "", category: "", sku: "", unit: "Piece",
    purchasePrice: 0, sellingPrice: 0, gstPercent: 0, discountPercent: 0,
    minStockLevel: 5, status: "Active", returnable: true, damageProne: false, hazardous: false,
  });

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
    if (!form.category.trim()) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);
      await API.post("/products", data);
      toast.success("Product created successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Product creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  useEffect(() => {
    const hasChanges = Object.values(form).some(v => v !== "" && v !== 0 && v !== "Piece" && v !== "Active" && v !== true && v !== false);
    if (!hasChanges) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Product</h2>
          <p className="text-sm text-gray-400 mt-1">Add a new product to your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-card space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Product Name</label>
                <input name="productName" className={`${inputClass} ${errors.productName ? 'border-red-300 focus:ring-red-400' : ''}`} onChange={handleChange} required />
                {errors.productName && <p className="text-xs text-red-500 mt-1">{errors.productName}</p>}
              </div>
              <div><label className={labelClass}>Brand</label><input name="brand" className={inputClass} onChange={handleChange} /></div>
              <div>
                <label className={labelClass}>Category</label>
                <input name="category" className={`${inputClass} ${errors.category ? 'border-red-300 focus:ring-red-400' : ''}`} onChange={handleChange} required />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div><label className={labelClass}>SKU / Item Code</label><input name="sku" className={inputClass} onChange={handleChange} /></div>
              <div>
                <label className={labelClass}>Unit</label>
                <select name="unit" className={inputClass} onChange={handleChange}>
                  <option>Piece</option><option>Box</option><option>Kg</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass} onChange={handleChange}>
                  <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Discontinued">Discontinued</option>
                </select>
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
                <input type="number" name="purchasePrice" className={`${inputClass} ${errors.purchasePrice ? 'border-red-300 focus:ring-red-400' : ''}`} onChange={handleChange} />
                {errors.purchasePrice && <p className="text-xs text-red-500 mt-1">{errors.purchasePrice}</p>}
              </div>
              <div>
                <label className={labelClass}>Selling Price (₹)</label>
                <input type="number" name="sellingPrice" className={`${inputClass} ${errors.sellingPrice ? 'border-red-300 focus:ring-red-400' : ''}`} onChange={handleChange} />
                {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice}</p>}
              </div>
              <div><label className={labelClass}>GST %</label><input type="number" name="gstPercent" className={inputClass} onChange={handleChange} /></div>
              <div><label className={labelClass}>Discount %</label><input type="number" name="discountPercent" className={inputClass} onChange={handleChange} /></div>
              <div><label className={labelClass}>Min Stock Level</label><input type="number" name="minStockLevel" className={inputClass} onChange={handleChange} /></div>
            </div>
          </div>

          {/* Flags */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xs">3</span>
              Product Flags
            </h3>
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
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-xs">4</span>
              Product Image
            </h3>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-3 border border-gray-200 border-dashed rounded-xl text-sm bg-gray-50" />
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-60">
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProduct;