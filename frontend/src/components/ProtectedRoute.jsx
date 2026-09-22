import { Navigate, Outlet } from "react-router-dom";


function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");


  if (!token) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRole && role !== allowedRole) {
    if (role === "buyer") {
      return <Navigate to="/buyer" replace />;
    }

    if (role === "supplier") {
      return <Navigate to="/supplier" replace />;
    }

    return <Navigate to="/login" replace />;
  }


  return <Outlet />;
}


export default ProtectedRoute;