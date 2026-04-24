import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { getProducts } from "../services/productService";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      if (data) setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = ["Semua", "Pria", "Wanita", "Aksesoris"];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-32">
      <div className="flex flex-col lg:flex-row gap-24">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-16">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-bold mb-10">Categories</h3>
            <ul className="flex flex-col gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-text-secondary">
              {categories.map(cat => (
                <li key={cat} className="flex justify-between items-center group">
                  <button 
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer transition-all ${selectedCategory === cat ? "text-white translate-x-2" : "hover:text-white"}`}
                  >
                    {cat}
                  </button>
                  {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-bold mb-10">Search</h3>
            <div className="relative group">
               <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 placeholder="Find your pieces..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent border-b border-white/10 pb-4 pl-8 text-[11px] uppercase tracking-widest text-white placeholder-text-secondary/30 focus:border-white transition-all"
               />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-bold mb-10">Price Range</h3>
            <div className="px-1">
              <div className="h-[1px] bg-white/10 relative">
                <div className="absolute left-0 w-[60%] h-full bg-white/40"></div>
                <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-white"></div>
                <div className="absolute left-[60%] -top-1 w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="flex justify-between mt-6 text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold tabular-nums">
                <span>Rp 100k</span>
                <span>Rp 2.500k</span>
              </div>
            </div>
          </section>

          <div className="hidden lg:block p-8 bg-surface-dark border border-white/5 rounded-3xl space-y-6">
             <p className="text-[11px] text-text-secondary italic leading-relaxed tracking-widest uppercase font-medium">
               "Elegance is the only beauty that never fades."
             </p>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white">Editorial Team</span>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-16">
          <header className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <h1 className="serif text-5xl lg:text-7xl font-bold italic text-white leading-tight">
                Archive <span className="font-sans not-italic font-light opacity-30">/ {selectedCategory}</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-bold">Displaying {filteredProducts.length} items</p>
            </div>
            
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">Sort by</span>
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="bg-transparent text-[10px] uppercase tracking-widest font-bold text-white border-none focus:ring-0 cursor-pointer p-0"
               >
                 <option value="default" className="bg-surface-dark">Relevance</option>
                 <option value="price-asc" className="bg-surface-dark">Price: Low to High</option>
                 <option value="price-desc" className="bg-surface-dark">Price: High to Low</option>
               </select>
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[3/4] bg-surface-dark rounded-[2.5rem]" />
                  <div className="h-2 bg-surface-dark rounded w-2/3" />
                  <div className="h-2 bg-surface-dark rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-8">
              <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto border border-white/5">
                 <Search size={24} className="text-white/20" />
              </div>
              <p className="text-text-secondary text-[11px] uppercase tracking-[0.3em] font-medium max-w-xs mx-auto">No items match your current selection.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="text-white text-[10px] font-bold border-b border-white pb-2 uppercase tracking-[0.4em] hover:opacity-70 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
