import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenForm: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onOpenForm }) => {
  const benefits = [
    "Recherche personnalisée illimitée",
    "Négociation experte du prix",
    "Inspection physique ou détaillée",
    "Gestion administrative complète",
    "Sécurisation financière totale",
    "Suivi logistique jusqu'à livraison"
  ];

  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-brand-surface">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-brand-dark">
          <div className="grid md:grid-cols-5">
            
            {/* Left Side: Value Prop */}
            <div className="md:col-span-3 p-10 md:p-16 bg-gradient-to-br from-slate-900 to-brand-dark flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">L'offre sérénité DOITZ</h3>
              <p className="text-slate-300 mb-10 leading-relaxed text-lg">
                Une tarification transparente pour un service clé en main. 
                <br/><strong className="text-white">Votre gain final doit être supérieur à notre coût.</strong>
              </p>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-blue-400" />
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Price */}
            <div className="md:col-span-2 p-10 md:p-16 bg-[#050912] flex flex-col justify-center items-center text-center border-l border-white/5 relative">
              <span className="text-brand-accent uppercase tracking-widest text-xs font-bold mb-6">Honoraires de gestion</span>
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-slate-500 mt-2">€</span>
                <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter font-display">2 700</span>
              </div>
              <p className="text-slate-500 text-xs mb-10">Hors frais de transport et taxes</p>
              
              <div className="bg-gradient-to-r from-green-900/20 to-green-900/10 border border-green-500/20 rounded-xl p-4 w-full mb-8">
                <p className="text-green-400 text-sm font-semibold">Rentabilité moyenne observée : <br/> <span className="text-lg">+ 5 300 €</span></p>
              </div>

              <button 
                onClick={onOpenForm}
                className="w-full py-4 rounded-xl bg-white text-brand-dark font-bold hover:bg-slate-200 transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Démarrer</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;