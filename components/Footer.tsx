import React from 'react';
import { Car, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="max-w-sm">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white">
                    <Car size={18} />
                </div>
                <span className="text-xl font-bold text-white">DOITZ<span className="text-brand-accent">.</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Le spécialiste de l'importation de véhicules premium. 
              Une approche transparente, sécurisée et rentable pour votre plaisir de conduire.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:matthieu+doitz-auto@zennest.io" className="flex items-center gap-3 text-gray-400 hover:text-brand-accent transition-colors">
                  <Mail size={18} />
                  <span>matthieu+doitz-auto@zennest.io</span>
                </a>
              </li>
              <li>
                <a href="tel:+33781727689" className="flex items-center gap-3 text-gray-400 hover:text-brand-accent transition-colors">
                  <Phone size={18} />
                  <span>+33 7 81 72 76 89</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Liens utiles</h4>
            <ul className="space-y-2">
                <li><a href="https://mattae.notion.site/Guide-complet-de-l-importation-de-v-hicules-trangers-2b32d6e3004d802aa702f83dac365ac1?source=copy_link" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">Le Guide complet</a></li>
                <li><a href="#process" className="text-gray-400 hover:text-white text-sm">Notre processus</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white text-sm">Tarifs</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center md:text-left">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} DOITZ. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;