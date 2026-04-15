import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Progress:", { 
    loading, 
    user: currentUser?.email, 
    userRole, 
    requiredRole 
  });

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!currentUser) {
    console.warn("ProtectedRoute - No user logged in. Redirecting to login.");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Use trim() and lowercase for safety
  const sanitizedRole = userRole?.trim().toLowerCase();
  
  if (requiredRole && sanitizedRole !== requiredRole.toLowerCase()) {
    console.error(`ProtectedRoute - Access Denied. Required: ${requiredRole}, Found: ${sanitizedRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
