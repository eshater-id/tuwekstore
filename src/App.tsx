import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Tentang from "./pages/Tentang";
import Kontak from "./pages/Kontak";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { getStoreSettings } from "./services/productService";
import { StoreSettings } from "./types";

export default function App() {
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: "628123456789",
    storeName: "FashionVibe",
    storeAddress: "Jakarta, Indonesia",
    googleMapsUrl: "",
  });

  useEffect(() => {
    getStoreSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/katalog" element={<Catalog />} />
              <Route path="/produk/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/kontak" element={<Kontak />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-bg-dark border-t border-white/5 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white flex items-center justify-center font-bold text-black text-lg">E</div>
                    <span className="serif text-xl font-bold tracking-[0.3em] uppercase">{settings.storeName.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed uppercase tracking-widest font-medium">
                    Gaya hidup modern dengan sentuhan elegan untuk setiap kesempatan.
                  </p>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Navigasi</h4>
                  <ul className="space-y-4 text-[11px] uppercase tracking-[0.1em] text-text-secondary font-medium">
                    <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                    <li><Link to="/katalog" className="hover:text-white transition-colors">Collection</Link></li>
                    <li><Link to="/tentang" className="hover:text-white transition-colors">Lookbook</Link></li>
                  </ul>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Bantuan</h4>
                  <ul className="space-y-4 text-[11px] uppercase tracking-[0.1em] text-text-secondary font-medium">
                    <li><Link to="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pengiriman</a></li>
                  </ul>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Lokasi</h4>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden grayscale contrast-125 opacity-30 group hover:opacity-100 transition-opacity bg-white/5 border border-white/10 p-6 flex flex-col justify-center text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{settings.storeAddress}</p>
                  </div>
                </div>
              </div>
              <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">
                <p>&copy; 2026 {settings.storeName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">TikTok</a>
                </div>
              </div>
            </div>
          </footer>

          <FloatingWhatsApp phoneNumber={settings.whatsappNumber} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
