import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface FloatingWhatsAppProps {
  phoneNumber: string;
}

export default function FloatingWhatsApp({ phoneNumber }: FloatingWhatsAppProps) {
  const handleClick = () => {
    const message = "Halo ESHATER.ID, saya ingin bertanya tentang koleksi Anda.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4 z-40 group">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block bg-white/5 backdrop-blur-md border border-white/10 p-3 px-5 rounded-full text-[10px] text-white font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Chat with our Stylist
      </motion.div>
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 bg-[#25D366] rounded-full shadow-[0_0_40px_rgba(37,211,102,0.3)] flex items-center justify-center hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] transition-all animate-bounce"
        id="whatsapp-floating-btn"
      >
        <MessageCircle size={32} className="text-white" fill="currentColor" />
      </motion.button>
    </div>
  );
}
