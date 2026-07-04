import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import Select from "react-select";
import { toast } from "react-toastify";
import { Package, Truck, ShieldCheck, Tag, DollarSign, Save } from "lucide-react";

const Purchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierMode, setSupplierMode] = useState("existing");
  const [productMode, setProductMode] = useState("existing");

  const [form, setForm] = useState({
    supplierId: "",
    supplierName: "",
    supplierPhone: "",
    supplierEmail: "",

    productId: "",
    productName: "",
    brand: "",
    category: "",
    sku: "",
    unit: "",
    purchasePrice: 0,
    sellingPrice: 0,
    gstPercent: 0,
    discountPercent: 0,
    minStockLevel: 0,
    returnable: false,
    damageProne: false,
    hazardous: false,

    quantity: 1,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    API.get("/suppliers").then((res) => setSuppliers(res.data.data || [])).catch(() => toast.error("Failed to load suppliers"));
    API.get("/products").then((res) => setProducts(res.data.data || [])).catch(() => toast.error("Failed to load products"));
  }, []);

  const supplierOptions = suppliers.map((s) => ({
    value: s._id,
    label: s.supplierName || s.name,
  }));

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.productName,
  }));

  const generateSKU = () => {
    const random = Math.floor(Math.random() * 100000);
    setForm({
      ...form,
      sku: "SKU-" + random,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProductSelect = (id) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    setForm({
      ...form,
      productId: id,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (image) data.append("image", image);

      data.append("supplierMode", supplierMode);
      data.append("productMode", productMode);

      await API.post("/purchases", data);
      toast.success("Purchase completed");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Purchase failed");
    }
  };

  const inputClass = "w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition bg-gray-50 focus:bg-white";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Purchase Inventory</h2>
          <p className="text-sm text-gray-400 mt-1">Restock your inventory and manage supplier records</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* --- SUPPLIER SECTION --- */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Truck size={18} /></div>
                Supplier Details
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supplier Type</label>
                  <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button type="button" onClick={() => setSupplierMode("existing")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${supplierMode === "existing" ? "bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-700"}`}>Existing Supplier</button>
                    <button type="button" onClick={() => setSupplierMode("new")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${supplierMode === "new" ? "bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-700"}`}>Create New</button>
                  </div>
                </div>

                {supplierMode === "existing" ? (
                  <div className="animate-fade-in pt-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Supplier</label>
                    <Select
                      options={supplierOptions}
                      placeholder="Search Supplier..."
                      onChange={(selected) => setForm({ ...form, supplierId: selected.value })}
                      styles={{ control: (base) => ({ ...base, padding: "4px", borderRadius: "0.75rem", borderColor: "#e5e7eb", boxShadow: "none", "&:hover": { borderColor: "#C5BAFF" } }) }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mt-4">
                    <input name="supplierName" placeholder="Supplier Company Name" className={inputClass} onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="supplierPhone" placeholder="Phone Number" className={inputClass} onChange={handleChange} />
                      <input name="supplierEmail" placeholder="Email Address" className={inputClass} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- PRODUCT SECTION --- */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Package size={18} /></div>
                Product Details
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Type</label>
                  <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button type="button" onClick={() => setProductMode("existing")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${productMode === "existing" ? "bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-700"}`}>Existing Product</button>
                    <button type="button" onClick={() => setProductMode("new")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${productMode === "new" ? "bg-white text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "text-gray-500 hover:text-gray-700"}`}>Create New</button>
                  </div>
                </div>

                {productMode === "existing" ? (
                  <div className="animate-fade-in pt-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Product</label>
                    <Select
                      options={productOptions}
                      placeholder="Search Product..."
                      onChange={(selected) => handleProductSelect(selected.value)}
                      styles={{ control: (base) => ({ ...base, padding: "4px", borderRadius: "0.75rem", borderColor: "#e5e7eb", boxShadow: "none", "&:hover": { borderColor: "#C5BAFF" } }) }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="productName" placeholder="Product Name" className={inputClass} onChange={handleChange} required />
                      <input name="brand" placeholder="Brand" className={inputClass} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select name="category" className={inputClass} onChange={handleChange}>
                        <option value="">Select Category</option>
                        <option>Hand Tools</option>
                        <option>Power Tools</option>
                        <option>Electrical</option>
                        <option>Hardware</option>
                      </select>
                      <select name="unit" className={inputClass} onChange={handleChange}>
                        <option value="">Select Unit</option>
                        <option>Piece</option>
                        <option>Box</option>
                        <option>Kg</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <input value={form.sku} placeholder="SKU Code" className={`${inputClass} flex-1`} readOnly />
                      <button type="button" onClick={generateSKU} className="bg-gray-200 px-5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-300 transition whitespace-nowrap">Auto Generate</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- NEW PRODUCT ATTRIBUTES (Only if new product) --- */}
          {productMode === "new" && (
            <div className="bg-white p-8 rounded-2xl shadow-card border border-gray-100 animate-fade-in">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Tag size={18} /></div>
                Pricing & Attributes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Purchase Price</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="purchasePrice" className={`${inputClass} pl-10`} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selling Price</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="sellingPrice" className={`${inputClass} pl-10`} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">GST %</label>
                  <input type="number" name="gstPercent" className={inputClass} onChange={handleChange} placeholder="e.g. 18" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Discount %</label>
                  <input type="number" name="discountPercent" className={inputClass} onChange={handleChange} placeholder="e.g. 10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Stock Alert Level</label>
                  <input type="number" name="minStockLevel" className={inputClass} onChange={handleChange} placeholder="Alert when stock falls below..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>
                  <input type="file" className={`${inputClass} !py-3`} onChange={handleImage} />
                </div>
              </div>

              <div className="flex gap-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="returnable" onChange={handleChange} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-emerald-500 checked:border-emerald-500 transition-colors" />
                    <ShieldCheck size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Returnable</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="damageProne" onChange={handleChange} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-rose-500 checked:border-rose-500 transition-colors" />
                    <ShieldCheck size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Damage Prone</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="hazardous" onChange={handleChange} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-amber-500 checked:border-amber-500 transition-colors" />
                    <ShieldCheck size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Hazardous</span>
                </label>
              </div>
            </div>
          )}

          {/* --- FINAL PURCHASE CONFIGURATION --- */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="w-full md:max-w-sm">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Quantity to Purchase</label>
              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-500 px-5 py-3.5 rounded-l-xl border border-r-0 border-gray-200 font-bold">Qty</span>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full p-3.5 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold text-gray-800"
                  min="1"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#b4a8ee] text-white font-bold px-10 py-4 rounded-xl shadow-[0_4px_16px_rgba(197,186,255,0.4)] hover:shadow-[0_8px_24px_rgba(197,186,255,0.6)] transition-all hover:-translate-y-1">
              <Save size={20} />
              Confirm Purchase
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
};

export default Purchase;