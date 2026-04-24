import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/katalog" },
    { name: "Lookbook", path: "/tentang" },
    { name: "Contact", path: "/kontak" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white flex items-center justify-center font-bold text-black text-lg transition-transform group-hover:scale-110">E</div>
            <span className="serif text-xl font-bold tracking-[0.3em] uppercase text-white">
              ESHATER<span className="font-thin text-text-secondary">.ID</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-text-secondary hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-text-secondary hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <Link to="/admin" className="text-text-secondary hover:text-white transition-colors">
              <User size={18} />
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/katalog" className="bg-white text-black px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-200 transition-all flex items-center gap-2">
              <ShoppingBag size={14} />
              <span>Shop Now</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-dark border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-xs font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-colors"
              >
                {isAdmin ? "Dashboard" : "Admin Panel"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
