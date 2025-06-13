import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/check-session", {
      withCredentials: true// gửi cookie session
    })
    .then(res => {
      if (res.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    })
    .catch(err => {
      console.error("Session check failed:", err);
      setIsAuthenticated(false);
    });
  }, []);

  if (isAuthenticated === null) {
    return <div>Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
