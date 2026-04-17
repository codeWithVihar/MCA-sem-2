import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CreateProduct";
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
import Purchase from "./pages/Purchase";
import SalesReturn from "./pages/SalesReturn";
import Suppliers from "./pages/Suppliers";
import Customer from "./pages/Customer";
import Checkout from "./pages/Checkout";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import OrderSuccess from "./pages/OrderSuccess";
import CustomerProfile from "./pages/CustomerProfile";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
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
     </Routes>\n    </BrowserRouter>
  );
}

export default App;
