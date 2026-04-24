import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Shield, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLogin() {
  const { user, isAdmin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin/dashboard");
    } else if (user && !isAdmin && !loading) {
      setError("Akses ditolak. Email Anda tidak terdaftar sebagai admin.");
    }
  }, [user, isAdmin, navigate, loading]);

  const handleLogin = async () => {
    try {
      setError("");
      setIsLoggingIn(true);
      await login();
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Jendela login ditutup sebelum selesai. Silakan coba lagi.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup diblokir oleh peramban. Silakan izinkan popup untuk situs ini.");
      } else {
        setError("Gagal masuk. Jika masalah berlanjut, coba buka aplikasi di tab baru.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface-dark border border-white/5 rounded-[2.5rem] shadow-2xl p-10 md:p-12 space-y-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-5 bg-white text-black rounded-2xl shadow-xl mx-auto">
            <Shield size={32} />
          </div>
          <div className="space-y-3">
            <h1 className="serif text-3xl font-bold tracking-tight text-white uppercase tracking-[0.2em]">Admin Cabinet</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-bold">Secure Access Portal</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 text-center justify-center"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white text-black py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
                <span>Masuk dengan Google</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-6 border-t border-white/5 text-center">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary hover:text-white transition-colors inline-flex items-center gap-2">
            Return to Store <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-bold text-text-secondary">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        System Secure
      </div>
    </div>
  );
}
