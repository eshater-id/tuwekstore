import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Tentang() {
  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
         <div className="absolute inset-0 bg-[#1A1A1A] overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent scale-150 animate-pulse" />
         </div>
         <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.4em] text-white/40"
            >
              Tentang FashionVibe
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="serif text-6xl md:text-8xl text-white font-bold leading-tight"
            >
              Mendefinisikan Ulang Gaya Modern.
            </motion.h1>
         </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
             <h2 className="serif text-5xl font-bold">Kisah Kami.</h2>
             <div className="space-y-6 text-lg text-[#1A1A1A]/60 leading-relaxed font-medium">
               <p>
                 FashionVibe lahir dari keinginan untuk menyajikan pakaian yang tidak hanya mengikuti tren, tetapi juga mengedepankan kualitas dan kenyamanan yang tak lekang oleh waktu.
               </p>
               <p>
                 Setiap helai benang dan potongan kain kami pilih dengan teliti, memastikan bahwa setiap produk yang Anda kenakan mencerminkan karakter dan kepercayaan diri Anda.
               </p>
             </div>
             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
                <div className="space-y-2">
                   <p className="text-4xl font-bold serif">10k+</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40">Pelanggan Puas</p>
                </div>
                <div className="space-y-2">
                   <p className="text-4xl font-bold serif">500+</p>
                   <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40">Desain Original</p>
                </div>
             </div>
          </div>
          <div className="aspect-[4/5] bg-gray-200 rounded-[3rem] relative overflow-hidden group">
             <img 
              src="https://images.unsplash.com/photo-1573162738289-49fde8ad929c?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              alt="FashionVibe Studio"
              referrerPolicy="no-referrer"
             />
             <div className="absolute bottom-8 left-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl max-w-xs shadow-xl">
                <p className="text-sm font-bold italic">"Gaya adalah cara untuk mengatakan siapa Anda tanpa harus berbicara."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-32 rounded-[4rem] mx-4 md:mx-8 shadow-2xl shadow-black/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-24">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40">Filosofi Kami</span>
              <h2 className="serif text-5xl font-bold">Kenapa FashionVibe?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               <div className="space-y-6 text-center shadow-lg p-10 rounded-3xl border border-black/5">
                  <div className="mx-auto w-16 h-16 bg-[#F9F9F7] rounded-2xl flex items-center justify-center">
                    <Heart className="text-[#EA4335]" />
                  </div>
                  <h3 className="text-xl font-bold">Dibuat Dengan Hati</h3>
                  <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                    Kami mendedikasikan waktu ekstra untuk memastikan setiap detail sempurna untuk Anda.
                  </p>
               </div>
               <div className="space-y-6 text-center shadow-lg p-10 rounded-3xl border border-black/5">
                  <div className="mx-auto w-16 h-16 bg-[#F9F9F7] rounded-2xl flex items-center justify-center">
                    <Sparkles className="text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold">Material Premium</h3>
                  <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                    Hanya menggunakan bahan terbaik yang nyaman di kulit dan tahan lama.
                  </p>
               </div>
               <div className="space-y-6 text-center shadow-lg p-10 rounded-3xl border border-black/5">
                  <div className="mx-auto w-16 h-16 bg-[#F9F9F7] rounded-2xl flex items-center justify-center">
                    <Users className="text-[#4285F4]" />
                  </div>
                  <h3 className="text-xl font-bold">Inklusivitas</h3>
                  <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                    Gaya untuk semua orang. Kami menyediakan berbagai ukuran dan gaya untuk beragam kepribadian.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-[#1A1A1A] rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="serif text-5xl md:text-6xl text-white font-bold max-w-2xl mx-auto leading-tight">
                Siap Menemukan Gaya Baru Anda?
              </h2>
              <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
                Jelajahi koleksi terbaru kami sekarang dan nikmati penawaran spesial untuk pembelian pertama.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <Link
                to="/katalog"
                className="inline-flex items-center justify-center bg-white text-[#1A1A1A] px-12 py-5 rounded-full text-sm font-bold hover:bg-[#F9F9F7] transition-all group"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
