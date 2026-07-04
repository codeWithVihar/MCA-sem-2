import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
