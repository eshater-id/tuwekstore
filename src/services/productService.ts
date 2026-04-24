import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Product, StoreSettings } from "../types";

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  const user = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || "Unknown Firestore error",
    operationType,
    path,
    authInfo: {
      userId: user?.uid || "unauthenticated",
      email: user?.email || "",
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || true,
      providerInfo: user?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || "",
        email: p.email || ""
      })) || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
}

export const getProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, "list", "products");
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Product;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, "get", `products/${id}`);
  }
};

export const addProduct = async (product: Omit<Product, "id" | "clicks" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      clicks: 0,
      createdAt: Date.now() // Or serverTimestamp() if rules allow
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, "create", "products");
  }
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, "update", `products/${id}`);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, "delete", `products/${id}`);
  }
};

export const incrementProductClick = async (id: string) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { clicks: increment(1) });
  } catch (error) {
    // Fail silently or handle
  }
};

export const getStoreSettings = async () => {
  try {
    const docRef = doc(db, "settings", "store");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as StoreSettings;
    }
    return {
      whatsappNumber: "628123456789",
      storeName: "FashionVibe",
      storeAddress: "Jakarta, Indonesia",
      googleMapsUrl: ""
    };
  } catch (error) {
    handleFirestoreError(error, "get", "settings/store");
  }
};

export const updateStoreSettings = async (settings: StoreSettings) => {
  try {
    const docRef = doc(db, "settings", "store");
    await updateDoc(docRef, settings as any);
  } catch (error) {
    handleFirestoreError(error, "update", "settings/store");
  }
};

// Admin Management Functions
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  addedAt: number;
  addedBy: string;
}

export const getAdmins = async () => {
  try {
    const q = query(collection(db, "admins"), orderBy("addedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as AdminUser));
  } catch (error) {
    handleFirestoreError(error, "list", "admins");
  }
};

export const addAdmin = async (email: string, displayName?: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak terautentikasi");
    
    // Cari user berdasarkan email dari Firebase Auth (via backend jika perlu)
    // Untuk saat ini, kita akan menyimpan email dan admin dapat diedit
    const adminDoc = {
      email,
      displayName: displayName || email.split("@")[0],
      addedAt: Date.now(),
      addedBy: user.email || "unknown"
    };
    
    // Simpan dengan email sebagai document ID (akan diupdate saat user pertama login)
    await addDoc(collection(db, "admins"), adminDoc);
    return true;
  } catch (error) {
    handleFirestoreError(error, "create", "admins");
  }
};

export const removeAdmin = async (uid: string) => {
  try {
    const docRef = doc(db, "admins", uid);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, "delete", `admins/${uid}`);
  }
};

export const updateAdmin = async (uid: string, data: Partial<AdminUser>) => {
  try {
    const docRef = doc(db, "admins", uid);
    await updateDoc(docRef, data as any);
    return true;
  } catch (error) {
    handleFirestoreError(error, "update", `admins/${uid}`);
  }
};
