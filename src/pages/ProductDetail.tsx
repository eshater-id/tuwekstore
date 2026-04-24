import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Share2, ArrowLeft, Heart, CheckCircle2, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../types";
import { getProductById, incrementProductClick, getStoreSettings } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("628123456789");
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      getProductById(id).then(data => {
        setProduct(data);
        setLoading(false);
        if (data) incrementProductClick(id);
      });
      getStoreSettings().then(s => {
        if (s) setWhatsappNumber(s.whatsappNumber);
      });
    }
  }, [id]);

  if (loading) {
     return <div className="max-w-7xl mx-auto px-4 py-32 text-center text-text-secondary uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-10">
        <h2 className="serif text-4xl font-bold text-white italic">Piece Not <span className="font-sans not-italic font-light opacity-30">Found</span></h2>
        <Link to="/katalog" className="inline-flex items-center gap-4 text-[10px] font-bold border-b border-white pb-2 uppercase tracking-[0.4em] text-white">
          <ArrowLeft size={14} /> Back to Collection
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleOrder = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color.");
      return;
    }
    const message = `Halo ESHATER.ID, saya ingin memesan:\n\nProduk: ${product.name}\nSize: ${selectedSize}\nColor: ${selectedColor}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-32">
      <div className="mb-12">
        <Link
          to="/katalog"
          className="inline-flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.4em] text-text-secondary hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Archives
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 xl:gap-32">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-surface-dark border border-white/5 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center space-y-12"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-secondary">
                {product.category}
              </span>
              <div className="h-0.5 w-8 bg-white/10" />
              {product.stock === "available" ? (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Now
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">Archived</span>
              )}
            </div>
            
            <h1 className="serif text-5xl md:text-7xl font-bold leading-[0.9] text-white tracking-tighter italic">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-text-secondary tabular-nums tracking-tighter">{formattedPrice}</p>
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-text-secondary leading-loose max-w-lg border-l border-white/10 pl-8 italic">
            {product.description}
          </p>

          {/* Selection */}
          <div className="space-y-12">
            {/* Color Selection */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Palette</h4>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
                      selectedColor === color
                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "bg-surface-dark text-text-secondary border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Size Guide</h4>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "bg-surface-dark text-text-secondary border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button
              disabled={product.stock !== "available"}
              onClick={handleOrder}
              className="flex-grow flex items-center justify-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(37,211,102,0.2)] disabled:opacity-30 group"
            >
              <MessageCircle size={18} />
              <span>Purchase to WhatsApp</span>
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all ${
                  isLiked ? "bg-red-500 border-red-500 text-white" : "bg-surface-dark border-white/10 text-text-secondary hover:text-white"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="w-16 h-16 rounded-full flex items-center justify-center bg-surface-dark border border-white/10 text-text-secondary hover:text-white transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
