import { ShoppingCart, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { motion } from "motion/react";
import type { Key } from "react";

interface ProductCardProps {
  product: Product;
  key?: Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
      id={`product-${product.id}`}
    >
      <Link to={`/produk/${product.id}`} className="block space-y-4">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-surface-dark mb-4 relative border border-white/5">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Status Badge */}
          {product.stock === "out_of_stock" && (
            <div className="absolute inset-0 bg-bg-dark/60 backdrop-blur-[2px] flex items-center justify-center p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 border border-white/10 px-6 py-2 rounded-full">
                Sold Out
              </span>
            </div>
          )}

          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/20">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start px-2">
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white truncate max-w-[150px]">
              {product.name}
            </h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-medium italic serif opacity-50">
              {product.category}
            </p>
          </div>
          <p className="text-[11px] font-medium text-text-secondary tabular-nums tracking-tighter">
            {formattedPrice}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
