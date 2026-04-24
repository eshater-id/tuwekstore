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
        // Check if user is in admins collection or is the bootstrap email
        const adminDoc = await getDoc(doc(db, "admins", currUser.uid));
        const isBootstrapAdmin = currUser.email === "agus.suyuti1922@gmail.com";
        setIsAdmin(adminDoc.exists() || isBootstrapAdmin);
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
      setAdmins(adminsList || []);
    } catch (error) {
      console.error("Error loading admins:", error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const addNewAdmin = async (email: string, displayName?: string) => {
    try {
      const result = await addAdmin(email, displayName);
      if (result) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding admin:", error);
      return false;
    }
  };

  const deleteAdmin = async (uid: string) => {
    try {
      const result = await removeAdmin(uid);
      if (result) {
        await refreshAdmins();
        return true;
      }
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
