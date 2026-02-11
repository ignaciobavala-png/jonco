import Link from "next/link";
import { JON_CONTACT } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        {/* Branding */}
        <div>
          <h3 className="text-2xl font-black tracking-tighter mb-6">
            JONCO<span className="text-gold">.</span>
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs uppercase tracking-tighter">
            Curadores de aventuras exclusivas en el Delta del Paraná. Naturaleza indómita y confort absoluto.
          </p>
        </div>
        
        {/* Navegación */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">Explorar</span>
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Inicio
          </Link>
          <Link href="/quienes-somos" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            Quiénes Somos
          </Link>
        </div>

        {/* Contacto Real */}
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">Contacto Directo</span>
          <p className="text-zinc-400 text-sm">Tigre, Buenos Aires, Argentina</p>
          <a 
            href={`mailto:${JON_CONTACT.email}`} 
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            {JON_CONTACT.email}
          </a>
        </div>
      </div>
      
      {/* Barra Inferior */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
          © {new Date().getFullYear()} Jonco Experience - Aventura Curada
        </p>
        
        <div className="flex gap-8 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
          <a 
            href={`https://instagram.com/${JON_CONTACT.instagram}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Instagram
          </a>
          <a 
            href={JON_CONTACT.getWhatsAppLink("Hola Jon! Quiero consultar por una aventura.")} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
};