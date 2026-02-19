import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone } from 'lucide-react';
import { PHONE, PHONE_DISPLAY, EMAIL, GUIDE_LINK } from '@/utils/constants';

const Footer = () => {
  return (
    <footer className="bg-black py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">

          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white">
                <Car size={18} />
              </div>
              <span className="text-xl font-bold text-white">DOITZ<span className="text-brand-accent">.</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Le spécialiste de l'importation de véhicules premium.
              Une approche transparente, sécurisée et rentable pour votre plaisir de conduire.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-gray-400 hover:text-brand-accent transition-colors">
                  <Mail size={18} />
                  <span>{EMAIL}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE}`} className="flex items-center gap-3 text-gray-400 hover:text-brand-accent transition-colors">
                  <Phone size={18} />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Liens utiles</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
              <li><a href={GUIDE_LINK} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">Le Guide complet</a></li>
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