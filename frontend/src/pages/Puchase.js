import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import Select from "react-select";

const Purchase = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplierMode, setSupplierMode] = useState("existing");
  const [productMode, setProductMode] = useState("existing");

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    supplierId: "",
    supplierName: "",
    supplierEmail: "",
    supplierPhone: "",

    productId: "",
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

    quantity: 1,

    returnable: true,
    damageProne: false,
    hazardous: false
  });

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {

    API.get("/suppliers")
      .then(res => {
        const data = res.data.data || res.data;
        setSuppliers(data);
      })
      .catch(() => alert("Failed to load suppliers"));

    API.get("/products")
      .then(res => {
        const data = res.data.data || res.data;
        setProducts(data);
      })
      .catch(() => alert("Failed to load products"));

  }, []);

  /* ---------------- SEARCHABLE OPTIONS ---------------- */

  const supplierOptions = suppliers.map(s => ({
    value: s._id,
    label: s.supplierName
  }));

  const productOptions = products.map(p => ({
    value: p._id,
    label: `${p.productName} ${p.brand ? `(${p.brand})` : ""}`
  }));

  /* ---------------- AUTO SKU ---------------- */

  const generateSKU = () => {

    const random = Math.floor(Math.random() * 100000);

    setForm({
      ...form,
      sku: "SKU-" + random
    });

  };

  /* ---------------- HANDLE INPUT ---------------- */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };

  /* ---------------- PRODUCT SELECT ---------------- */

  const handleProductSelect = (id) => {

    const product = products.find(p => p._id === id);

    if (!product) return;

    setForm({
      ...form,
      productId: id,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice
    });

  };

  /* ---------------- IMAGE ---------------- */

  const handleImage = (e) => {

    setImage(e.target.files[0]);

  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      if (image) data.append("image", image);

      data.append("supplierMode", supplierMode);
      data.append("productMode", productMode);

      await API.post("/purchases", data);

      alert("Purchase completed");

    } catch (err) {

      console.log(err);
      alert("Purchase failed");

    }

  };

  return (

    <Layout>

      <h2 className="text-2xl font-semibold mb-6">
        Purchase / Restock Inventory
      </h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-5xl">

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* ---------------- SUPPLIER MODE ---------------- */}

          <select
            value={supplierMode}
            onChange={(e) => setSupplierMode(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="existing">Existing Supplier</option>
            <option value="new">Create New Supplier</option>
          </select>

          {/* SEARCHABLE SUPPLIER */}

          {supplierMode === "existing" && (

            <Select
              options={supplierOptions}
              placeholder="Search Supplier..."
              onChange={(selected) => {
                setForm({
                  ...form,
                  supplierId: selected.value
                });
              }}
            />

          )}

          {/* CREATE NEW SUPPLIER */}

          {supplierMode === "new" && (

            <>
              <input
                name="supplierName"
                placeholder="Supplier Name"
                className="p-3 border rounded-lg"
                onChange={handleChange}
                required
              />

              <input
                name="supplierPhone"
                placeholder="Phone"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="supplierEmail"
                placeholder="Email"
                className="p-3 border rounded-lg col-span-2"
                onChange={handleChange}
              />
            </>

          )}

          {/* ---------------- PRODUCT MODE ---------------- */}

          <select
            value={productMode}
            onChange={(e) => setProductMode(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="existing">Existing Product</option>
            <option value="new">Create New Product</option>
          </select>

          {/* SEARCHABLE PRODUCT */}

          {productMode === "existing" && (

            <Select
              options={productOptions}
              placeholder="Search Product..."
              onChange={(selected) => {
                handleProductSelect(selected.value);
              }}
            />

          )}

          {/* ---------------- NEW PRODUCT ---------------- */}

          {productMode === "new" && (

            <>
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

              <select
                name="category"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              >
                <option>Select Category</option>
                <option>Hand Tools</option>
                <option>Power Tools</option>
                <option>Electrical</option>
                <option>Hardware</option>
              </select>

              <div className="flex gap-2">

                <input
                  value={form.sku}
                  placeholder="SKU"
                  className="p-3 border rounded-lg flex-1"
                  readOnly
                />

                <button
                  type="button"
                  onClick={generateSKU}
                  className="bg-gray-200 px-4 rounded"
                >
                  Generate
                </button>

              </div>

              <select
                name="unit"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              >
                <option>Piece</option>
                <option>Box</option>
                <option>Kg</option>
              </select>

              <input
                type="number"
                name="purchasePrice"
                placeholder="Purchase Price"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                type="number"
                name="sellingPrice"
                placeholder="Selling Price"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                type="number"
                name="gstPercent"
                placeholder="GST %"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                type="number"
                name="discountPercent"
                placeholder="Discount %"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                type="number"
                name="minStockLevel"
                placeholder="Minimum Stock"
                className="p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                type="file"
                className="p-3 border rounded-lg col-span-2"
                onChange={handleImage}
              />

              <div className="col-span-2 flex gap-6">

                <label>
                  <input type="checkbox" name="returnable" onChange={handleChange}/>
                  Returnable
                </label>

                <label>
                  <input type="checkbox" name="damageProne" onChange={handleChange}/>
                  Damage Prone
                </label>

                <label>
                  <input type="checkbox" name="hazardous" onChange={handleChange}/>
                  Hazardous
                </label>

              </div>
            </>
          )}

          {/* QUANTITY */}

          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            placeholder="Quantity"
          />

          {/* SUBMIT */}

          <button
            className="col-span-2 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
          >
            Complete Purchase
          </button>

        </form>

      </div>

    </Layout>

  );

};

export default Purchase;