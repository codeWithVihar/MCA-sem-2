import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (role !== "Admin") return <Navigate to="/dashboard" />;

  return children;
};

export default AdminRoute;
