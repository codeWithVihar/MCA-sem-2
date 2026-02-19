import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("Failed to load products"));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">All Products</h2>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-primary">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-soft">
                <td className="p-4">{p.productName}</td>
                <td className="p-4">{p.brand}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.currentStock}</td>
                <td className="p-4">₹{p.sellingPrice}</td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/edit-product/${p._id}`)}
                    className="text-blue-600 font-medium"
                  >
                    Edit
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

export default Products;
