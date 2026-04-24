import { ArrowRight, Truck, ShieldCheck, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      if (data) setProducts(data.filter(p => p.featured).slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-7xl mx-auto h-[600px] bg-surface-dark rounded-[3rem] overflow-hidden relative flex border border-white/5 shadow-2xl">
          <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center relative z-10">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold tracking-[0.4em] uppercase text-text-secondary mb-4"
            >
              Featured Capsule
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-light tracking-tighter text-white mb-8 leading-[0.85]"
            >
              Monochrome<br/>
              <span className="serif italic">Minimalism.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-xs uppercase tracking-[0.2em] font-medium max-w-sm mb-10 leading-loose"
            >
              Koleksi eksklusif yang mendefinisikan ulang batas kesederhanaan dan kemewahan modern.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/katalog" className="bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold px-12 py-5 w-fit rounded-full hover:bg-neutral-200 transition-all shadow-lg inline-block">
                View Collection
              </Link>
            </motion.div>
          </div>
          <div className="hidden lg:block w-1/2 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800')] bg-cover bg-center mix-blend-luminosity opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-dark to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-text-secondary">Signature Selection</span>
            <h2 className="serif text-5xl lg:text-6xl font-bold tracking-tight text-white italic">Curated <span className="font-sans not-italic font-light opacity-30">Essentials</span></h2>
          </div>
          <Link to="/katalog" className="hover:text-white text-text-secondary transition-colors text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-4 group">
            Discover All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[3/4] bg-surface-dark rounded-[2rem]" />
                <div className="h-4 bg-surface-dark rounded w-2/3" />
                <div className="h-4 bg-surface-dark rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-dark border border-white/5 rounded-[3rem] p-12 lg:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="serif text-4xl lg:text-5xl font-light italic leading-tight text-white leading-tight">
              Design is not just what it looks like, but <span className="font-sans not-italic font-bold tracking-tighter opacity-40 uppercase">how it feels.</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="space-y-3">
                <Truck size={24} className="text-white/40" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Global Logistics</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed uppercase tracking-wider">Premium handling for every single piece delivered to your door.</p>
              </div>
              <div className="space-y-3">
                <ShieldCheck size={24} className="text-white/40" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Ethical Craft</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed uppercase tracking-wider">Meticulously sourced materials with respect for nature and craft.</p>
              </div>
            </div>
          </div>
          <div className="aspect-square bg-bg-dark rounded-full flex items-center justify-center border border-white/5 shadow-inner">
             <div className="w-2/3 h-2/3 rounded-full bg-[url('https://images.unsplash.com/photo-1594932224010-75f2a77d96ba?w=600')] bg-cover bg-center grayscale border border-white/10" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl font-bold italic text-white leading-tight">Voices of <span className="font-sans not-italic font-light opacity-30">Moderna</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[1, 2, 3].map((i) => (
             <div key={i} className="p-10 bg-surface-dark border border-white/5 rounded-[2.5rem] space-y-6">
                <p className="text-xs italic text-text-secondary leading-loose tracking-widest uppercase">
                  "Pengalaman belanja yang luar biasa. Setiap detail diperhatikan dengan seksama."
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-neutral-800" />
                   <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Sarah Al-Attas</h4>
                      <p className="text-[9px] uppercase tracking-widest text-text-secondary opacity-50">Verified Member</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
