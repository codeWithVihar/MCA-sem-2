import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import StockManage from "./pages/StockManage";
import Sales from "./pages/Sales";
import Invoice from "./pages/Invoice";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import StaffManage from "./pages/StaffManage";
import AuditLogs from "./pages/AuditLogs";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setAuth={setAuth} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/stock-manage"
          element={
            <ProtectedRoute>
              <StockManage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/invoice/:id"
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
  path="/audit"
  element={
    <ProtectedRoute roles={["Admin"]}>
      <AuditLogs />
    </ProtectedRoute>
  }
/>

        <Route path="/products" element={<Products />} />
<Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/staff" element={<StaffManage />} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
