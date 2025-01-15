import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setUserRole(idTokenResult.claims.isAdmin ? "admin" : "regular");
      }
    };
    fetchRole();
  }, []);

  if (userRole === null) {
    return <div>Loading...</div>;
  }

  if (requiredRole === "admin" && userRole !== "admin") {
    return <Navigate to="/admindashboard" />;
  }

  if (requiredRole === "regular" && userRole !== "regular") {
    return <Navigate to="/userdashboard" />;
  }

  if (!userRole) {
    return <Navigate to="/userdashboard" />;
  }

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
