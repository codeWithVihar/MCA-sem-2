import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CrteateProduct";
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
import Purchase from "./pages/Puchase";
import SalesReturn from "./pages/SalesReturn";
import Suppliers from "./pages/Suppliers";

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
              <CreateProduct />
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
          path="/purchase"
          element={
            <ProtectedRoute>
              <Purchase />
            </ProtectedRoute>
          }
        />
        <Route
        path="/staff"
        element={
          <AdminRoute>
            <StaffManage />
          </AdminRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <AdminRoute>
            <Suppliers />
          </AdminRoute>
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
        <Route path="/sales-return" element={<SalesReturn />} />
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
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
