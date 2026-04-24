import { useState, useEffect } from "react";
import { 
  Plus, Settings, Package, PieChart, LogOut, 
  Trash2, Edit, Save, X, Upload, Check, ExternalLink,
  Users, Mail, Calendar, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, StoreSettings } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getStoreSettings, 
  updateStoreSettings 
} from "../services/productService";

export default function AdminDashboard() {
  const { user, isAdmin, signOut, loading: authLoading, admins, loadingAdmins, addNewAdmin, deleteAdmin, refreshAdmins } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"products" | "stats" | "settings" | "admins">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: "628123456789",
    storeName: "ESHATER.ID",
    storeAddress: "Jakarta, Indonesia",
    googleMapsUrl: "",
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([getProducts(), getStoreSettings()]).then(([pData, sData]) => {
        if (pData) setProducts(pData);
        if (sData) setSettings(sData);
        setLoading(false);
      });
      refreshAdmins();
    }
  }, [isAdmin]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    category: "Pria",
    sizes: [],
    colors: [],
    stock: "available",
    image: "",
    featured: false
  });

  const handleAddProduct = async () => {
    const id = await addProduct(newProduct as any);
    if (id) {
       const refreshed = await getProducts();
       if (refreshed) setProducts(refreshed);
       setIsAddingProduct(false);
       setNewProduct({
        name: "",
        price: 0,
        description: "",
        category: "Pria",
        sizes: [],
        colors: [],
        stock: "available",
        image: "",
        featured: false
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddAdmin = async () => {
    setAdminError("");
    setAdminSuccess("");
    
    if (!newAdminEmail.trim()) {
      setAdminError("Email tidak boleh kosong");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminEmail)) {
      setAdminError("Format email tidak valid");
      return;
    }
    
    setIsAddingAdmin(true);
    try {
      const success = await addNewAdmin(newAdminEmail.trim(), newAdminName.trim());
      if (success) {
        setAdminSuccess("Admin berhasil ditambahkan!");
        setNewAdminEmail("");
        setNewAdminName("");
        setTimeout(() => setAdminSuccess(""), 3000);
      } else {
        setAdminError("Gagal menambahkan admin");
      }
    } catch (error: any) {
      setAdminError(error.message || "Terjadi kesalahan");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (uid: string) => {
    if (confirm("Yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        const success = await deleteAdmin(uid);
        if (success) {
          setAdminSuccess("Admin berhasil dihapus!");
          setTimeout(() => setAdminSuccess(""), 3000);
        }
      } catch (error: any) {
        setAdminError("Gagal menghapus admin");
      }
    }
  };

  const handleSaveSettings = async () => {
    await updateStoreSettings(settings);
    alert("Pengaturan disimpan!");
  };

  if (authLoading || loading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-[10px] uppercase tracking-[0.4em] text-text-secondary animate-pulse">Synchronizing Security...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg-dark flex text-text-primary">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-dark border-r border-white/5 hidden lg:flex flex-col">
        <div className="h-24 px-8 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-white flex items-center justify-center font-bold text-black text-lg transition-transform group-hover:scale-110">E</div>
          <span className="serif text-lg font-bold tracking-[0.2em] uppercase">Cabinet <span className="font-thin opacity-30">v1.3</span></span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "products" ? "bg-white text-black shadow-[0_0_20px_white/10]" : "text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <Package size={16} />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "stats" ? "bg-white text-black shadow-[0_0_20px_white/10]" : "text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <PieChart size={16} />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "admins" ? "bg-white text-black shadow-[0_0_20px_white/10]" : "text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <Users size={16} />
            Admin Users
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "settings" ? "bg-white text-black shadow-[0_0_20px_white/10]" : "text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings size={16} />
            System Config
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
           <div className="bg-bg-dark border border-white/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Live Services</span>
              </div>
              <p className="text-[9px] text-text-secondary uppercase tracking-tight leading-loose font-medium">Google Sheets: Connected<br/>Media Sync: Active</p>
           </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Terminate
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-12 lg:p-16 space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5">
            <div className="space-y-4">
              <h1 className="serif text-5xl font-bold italic text-white flex items-center gap-4">
                {activeTab === "products" && (<><Package size={32} className="opacity-20" /> Archive Control</>)}
                {activeTab === "stats" && (<><PieChart size={32} className="opacity-20" /> Performance</>)}
                {activeTab === "admins" && (<><Users size={32} className="opacity-20" /> Admin Users</>)}
                {activeTab === "settings" && (<><Settings size={32} className="opacity-20" /> Config</>)}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-bold">Admin: {user?.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {activeTab === "products" && (
                <>
                  <button 
                    onClick={async () => {
                      const res = await fetch("/api/sync-sheets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ products }),
                      });
                      const data = await res.json();
                      if (data.success) alert("Sinkronisasi Spreadsheet Berhasil!");
                      else alert("Gagal: " + data.error);
                    }}
                    className="bg-surface-dark border border-white/5 text-white px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <Save size={14} />
                    Sync Sheets
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-[0_10px_30px_white/10]"
                  >
                    <Plus size={14} />
                    New Archive
                  </button>
                </>
              )}
              {activeTab === "admins" && (
                <button
                  onClick={() => setIsAddingAdmin(true)}
                  className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-[0_10px_30px_white/10]"
                >
                  <Plus size={14} />
                  Add Admin
                </button>
              )}
            </div>
          </div>

          {/* Tabs Content */}
          <AnimatePresence mode="wait">
            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="bg-surface-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-bg-dark/50 text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary border-b border-white/5">
                        <th className="px-10 py-6">Identity</th>
                        <th className="px-10 py-6">Valuation</th>
                        <th className="px-10 py-6">State</th>
                        <th className="px-10 py-6">Metrics</th>
                        <th className="px-10 py-6 text-right">Manipulation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/5">
                                 <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">{p.name}</h4>
                                <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] font-bold italic">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-[11px] font-medium tabular-nums text-text-secondary">Rp {p.price.toLocaleString()}</td>
                          <td className="px-10 py-8">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                              p.stock === "available" ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" : "border-red-500/20 text-red-500 bg-red-500/5"
                            }`}>
                              {p.stock === "available" ? "Live" : "Archived"}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-[11px] font-medium tabular-nums text-text-secondary">{p.clicks} <span className="text-[9px] uppercase tracking-tighter opacity-30 font-bold ml-1">Hits</span></td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex justify-end gap-3">
                                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white border border-white/5">
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-3 bg-red-500/5 hover:bg-red-500/20 rounded-xl transition-all text-red-500 border border-red-500/10"
                                >
                                  <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
              >
                <div className="lg:col-span-2 bg-surface-dark p-12 rounded-[2.5rem] border border-white/5 space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Direct WhatsApp</label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                          className="w-full px-6 py-5 bg-bg-dark rounded-2xl text-[11px] font-bold tracking-widest text-white border border-white/5 focus:border-white/20 transition-all"
                        />
                         <p className="text-[9px] text-text-secondary/40 font-bold uppercase tracking-widest italic">Format: 628123456789</p>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Identity / Store Name</label>
                        <input
                          type="text"
                          value={settings.storeName}
                          onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                          className="w-full px-6 py-5 bg-bg-dark rounded-2xl text-[11px] font-bold tracking-widest text-white border border-white/5 focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Base Location</label>
                        <textarea
                          value={settings.storeAddress}
                          onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                          className="w-full px-6 py-5 bg-bg-dark rounded-2xl text-[11px] font-bold tracking-widest text-white h-32 resize-none border border-white/5 focus:border-white/20 transition-all uppercase"
                        />
                      </div>
                   </div>
                   <div className="flex justify-end">
                      <button 
                        onClick={handleSaveSettings}
                        className="bg-white text-black px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-200 transition-all shadow-[0_10px_30px_white/10] flex items-center gap-3"
                      >
                        <Save size={16} />
                        Update Config
                      </button>
                   </div>
                </div>

                <div className="space-y-12">
                   <div className="p-10 bg-surface-dark border border-white/5 rounded-[2.5rem] space-y-8">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">External Logs</h4>
                      <div className="space-y-6">
                         <div className="flex justify-between items-center group cursor-pointer">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Google Sheet</span>
                            <ExternalLink size={14} className="opacity-30" />
                         </div>
                         <div className="flex justify-between items-center group cursor-pointer">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Media Cloud</span>
                            <ExternalLink size={14} className="opacity-30" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "admins" && (
              <motion.div
                key="admins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Messages */}
                <AnimatePresence>
                  {adminError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-[11px] font-bold uppercase tracking-wider"
                    >
                      {adminError}
                    </motion.div>
                  )}
                  {adminSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-2xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-3"
                    >
                      <Check size={16} />
                      {adminSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Admin List */}
                <div className="bg-surface-dark rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                  {loadingAdmins ? (
                    <div className="p-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    </div>
                  ) : admins && admins.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-bg-dark/50 text-[9px] font-bold uppercase tracking-[0.3em] text-text-secondary border-b border-white/5">
                          <th className="px-10 py-6">Email</th>
                          <th className="px-10 py-6">Name</th>
                          <th className="px-10 py-6">Added By</th>
                          <th className="px-10 py-6">Date</th>
                          <th className="px-10 py-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {admins.map((admin) => (
                          <tr key={admin.uid} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-3">
                                <Mail size={14} className="opacity-50" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white">{admin.email}</span>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-[11px] font-medium text-text-secondary">{admin.displayName || "-"}</td>
                            <td className="px-10 py-8 text-[10px] text-text-secondary uppercase tracking-tighter">{admin.addedBy}</td>
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase tracking-tighter">
                                <Calendar size={12} className="opacity-50" />
                                {new Date(admin.addedAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button
                                onClick={() => handleRemoveAdmin(admin.uid)}
                                className="p-3 bg-red-500/5 hover:bg-red-500/20 rounded-xl transition-all text-red-500 border border-red-500/10 inline-flex"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-[11px] text-text-secondary uppercase tracking-wider">
                      Tidak ada admin terdaftar
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsAddingProduct(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-dark rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 md:p-16 space-y-12 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                  <h2 className="serif text-4xl font-bold text-white italic">New Archive <span className="font-sans not-italic font-light opacity-30">Entry</span></h2>
                  <button onClick={() => setIsAddingProduct(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Image Picker */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Capture Source</label>
                    <div 
                      onClick={() => document.getElementById("product-image-upload")?.click()}
                      className="aspect-[3/4] w-full bg-bg-dark border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 group cursor-pointer hover:border-white/20 transition-all overflow-hidden relative"
                    >
                      {newProduct.image ? (
                        <img src={newProduct.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Preview" />
                      ) : (
                        <>
                          <div className="p-6 bg-white/5 rounded-full border border-white/10">
                            <Upload size={32} className="text-white/20" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Upload Visuals</p>
                            <p className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Automatic cloud synchronization</p>
                          </div>
                        </>
                      )}
                      <input 
                        id="product-image-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("file", file);
                            try {
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                              });
                              const data = await res.json();
                              if (data.url) {
                                setNewProduct({ ...newProduct, image: data.url });
                              }
                            } catch (err) {
                              console.error("Upload failed", err);
                              alert("Upload gagal");
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Piece Name</label>
                         <input 
                          type="text" 
                          value={newProduct.name}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[11px] font-bold text-white tracking-widest focus:border-white/20 transition-all" 
                          placeholder="e.g. Signature Trench"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Valuation (IDR)</label>
                           <input 
                            type="number" 
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[11px] font-bold text-white tracking-widest focus:border-white/20 transition-all tabular-nums" 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Collection</label>
                           <select 
                            value={newProduct.category}
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white focus:ring-0 focus:border-white/20 transition-all appearance-none"
                           >
                             <option className="bg-surface-dark">Pria</option>
                             <option className="bg-surface-dark">Wanita</option>
                             <option className="bg-surface-dark">Aksesoris</option>
                           </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Technical Specs / Description</label>
                      <textarea 
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[11px] font-bold text-white tracking-widest h-40 resize-none focus:border-white/20 transition-all leading-loose"
                        placeholder="Define the elements of this creation..."
                      />
                    </div>

                    <div className="flex gap-6 pt-6">
                      <button 
                        onClick={() => setIsAddingProduct(false)}
                        className="flex-grow px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary border border-white/10 hover:bg-white/5 transition-all"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={handleAddProduct}
                        className="flex-grow bg-white text-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-200 transition-all shadow-[0_10px_30px_white/10] flex items-center justify-center gap-3"
                      >
                        <Check size={18} />
                        Commission Archive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAddingAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsAddingAdmin(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-dark rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 md:p-16 space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="serif text-4xl font-bold text-white italic">Add Admin <span className="font-sans not-italic font-light opacity-30">User</span></h2>
                  <button onClick={() => setIsAddingAdmin(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Email Address</label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[11px] font-bold text-white tracking-widest focus:border-white/20 transition-all"
                    />
                    <p className="text-[9px] text-text-secondary/40 font-bold uppercase tracking-widest italic">Harus email yang valid dan terdaftar di Google</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Display Name (Optional)</label>
                    <input
                      type="text"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="Admin Name"
                      className="w-full bg-bg-dark border border-white/5 rounded-2xl px-6 py-5 text-[11px] font-bold text-white tracking-widest focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="flex gap-6 pt-6">
                    <button
                      onClick={() => setIsAddingAdmin(false)}
                      className="flex-grow px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary border border-white/10 hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAdmin}
                      disabled={isAddingAdmin}
                      className="flex-grow bg-white text-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-200 transition-all shadow-[0_10px_30px_white/10] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isAddingAdmin ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      ) : (
                        <Check size={18} />
                      )}
                      {isAddingAdmin ? "Adding..." : "Add Admin"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
