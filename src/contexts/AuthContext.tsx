import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle, logout } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAdmins, addAdmin, removeAdmin, AdminUser } from "../services/productService";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  signOut: () => Promise<void>;
  admins: AdminUser[];
  loadingAdmins: boolean;
  addNewAdmin: (email: string, displayName?: string) => Promise<boolean>;
  deleteAdmin: (uid: string) => Promise<boolean>;
  refreshAdmins: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        // Check if user is the bootstrap admin
        const isBootstrapAdmin = currUser.email === "agus.suyuti1922@gmail.com";
        
        if (isBootstrapAdmin) {
          setIsAdmin(true);
          console.log("✓ Admin login: Bootstrap email recognized");
        } else if (currUser.email) {
          // Try to find admin document by lowercase email
          try {
            const normalizedEmail = currUser.email.toLowerCase();
            const adminRef = doc(db, "admins", normalizedEmail);
            const adminDoc = await getDoc(adminRef);
            
            if (adminDoc.exists()) {
              setIsAdmin(true);
              console.log("✓ Admin login: Found in admins collection -", currUser.email);
            } else {
              setIsAdmin(false);
              console.log("✗ Not admin: Not found in admins collection -", currUser.email);
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    await loginWithGoogle();
  };

  const signOut = async () => {
    await logout();
  };

  const refreshAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const adminsList = await getAdmins();
      if (adminsList) {
        setAdmins(adminsList);
        console.log("✓ Loaded admins:", adminsList.length);
      }
    } catch (error) {
      console.error("Error loading admins:", error);
      setAdmins([]);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const addNewAdmin = async (email: string, displayName?: string) => {
    try {
      console.log("Adding new admin:", email);
      const result = await addAdmin(email, displayName);
      if (result) {
        console.log("✓ Admin added successfully");
        await refreshAdmins();
        return true;
      }
      console.error("Admin add returned false");
      return false;
    } catch (error) {
      console.error("Error adding admin:", error);
      return false;
    }
  };

  const deleteAdmin = async (uid: string) => {
    try {
      console.log("Deleting admin:", uid);
      const result = await removeAdmin(uid);
      if (result) {
        console.log("✓ Admin deleted successfully");
        await refreshAdmins();
        return true;
      }
      console.error("Admin delete returned false");
      return false;
    } catch (error) {
      console.error("Error deleting admin:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin, 
        loading, 
        login, 
        signOut,
        admins,
        loadingAdmins,
        addNewAdmin,
        deleteAdmin,
        refreshAdmins
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
