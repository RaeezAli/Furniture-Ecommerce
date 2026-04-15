import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

// The globally accessible Auth Context
export const AuthContext = createContext();

// Custom hook for easy consumption
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeRole = null;

    // Check for demo admin bypass first
    const isDemoAdmin = localStorage.getItem("furniro_demo_admin") === "true";
    if (isDemoAdmin) {
      setCurrentUser({
        email: "admin@example.com",
        displayName: "Demo Admin",
        uid: "demo-admin-id"
      });
      setUserRole("admin");
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        // Listen to user document in real-time
        unsubscribeRole = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (user.email === "admin@example.com") {
            setUserRole("admin");
          } else if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Current User Role:", userData.role);
            setUserRole(userData.role);
          } else {
            console.warn("No user document found for UID:", user.uid);
            setUserRole("customer");
          }
          setLoading(false);
        }, (error) => {
          if (user.email === "admin@example.com") {
            setUserRole("admin");
          } else {
            console.error("Error listening to user role:", error);
            setUserRole("customer");
          }
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
        if (unsubscribeRole) unsubscribeRole();
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      if (unsubscribeRole) unsubscribeRole();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};