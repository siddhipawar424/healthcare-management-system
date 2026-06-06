import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const isAdmin =
    localStorage.getItem("admin");

  return isAdmin
    ? children
    : <Navigate to="/admin-login" />;
}

export default ProtectedRoute;