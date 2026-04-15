import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to easily consume auth state
 * Returns: { currentUser, userRole, loading }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
