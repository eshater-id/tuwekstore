import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";

export default function Kontak() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Pesan Anda telah terkirim! Admin kami akan menghubungi Anda segera.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Info Detail */}
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/40">Hubungi Kami</span>
            <h1 className="serif text-5xl md:text-7xl font-bold leading-[1.1]">Mari Berbincang Tentang Gaya Anda.</h1>
            <p className="text-lg text-[#1A1A1A]/60 leading-relaxed max-w-md">
              Ada pertanyaan? Tim kami siap membantu Anda menemukan pilihan terbaik.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-black/5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">WhatsApp</p>
                <p className="text-lg font-bold">+62 812 3456 789</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-black/5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Email</p>
                <p className="text-lg font-bold">hello@fashionvibe.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-black/5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Lokasi</p>
                <p className="text-lg font-bold">Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-[2/1] bg-gray-200 rounded-[2rem] overflow-hidden grayscale contrast-125 border border-black/5 shadow-2xl shadow-black/5">
             <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest">
               Google Maps Embed Integrasi
             </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-black/5 border border-black/5"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4 text-center pb-4">
               <h3 className="serif text-3xl font-bold">Kirim Pesan</h3>
               <p className="text-sm text-[#1A1A1A]/40">Kami akan merespon dalam waktu 24 jam kerja.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 ml-4">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-8 py-5 bg-[#F9F9F7] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                placeholder="Ex: Alexander Graham"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 ml-4">Email</label>
              <input
                type="email"
                required
                className="w-full px-8 py-5 bg-[#F9F9F7] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                placeholder="alex@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 ml-4">Pesan</label>
              <textarea
                required
                rows={4}
                className="w-full px-8 py-5 bg-[#F9F9F7] rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                placeholder="Bagaimana kami bisa membantu Anda?"
              />
            </div>

            <button
               type="submit"
               className="w-full bg-[#1A1A1A] text-white py-6 rounded-3xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-[#333] transition-all group shadow-xl shadow-black/10"
            >
              <span>Kirim Pesan</span>
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="w-full h-px bg-black/5" />
              <button 
                type="button"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#25D366] hover:opacity-80 transition-opacity"
                onClick={() => window.open('https://wa.me/628123456789', '_blank')}
              >
                <MessageSquare size={16} /> Chat Langsung via WhatsApp
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
