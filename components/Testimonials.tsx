import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { TestimonialType } from '../types';

const Testimonials = () => {
  const testimonials: TestimonialType[] = [
    {
      id: 1,
      name: "Agnès",
      role: "Directrice RH",
      car: "Mini Countryman ALL4",
      savings: "14 000€ économisés",
      quote: "Je cherchais une configuration très spécifique. DOITZ a trouvé ma Mini 'Hot Chili' quasi neuve en Allemagne. Full options et une économie record. Bluffant.",
      image: "" 
    },
    {
      id: 2,
      name: "Jonathan",
      role: "Commerçant",
      car: "Volvo XC40 Recharge",
      savings: "8 000€ économisés",
      quote: "Véhicule de société acheté en toute confiance. Matthieu m'a même conseillé sur l'abattement de 70% sur l'avantage en nature. Un service à 360°.",
      image: "" 
    },
    {
      id: 3,
      name: "Matthieu",
      role: "Entrepreneur",
      car: "Fiat 500e Premier Édition",
      savings: "Subventions maximisées",
      quote: "Il a déniché une pépite à Monaco avec un kilométrage ridicule. J'ai pu bénéficier du maximum des subventions pour VE. Le ROI est imbattable.",
      image: "" 
    }
  ];

  return (
    <section id="testimonials" className="py-32 bg-slate-900/50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">Ils ont fait confiance à <span className="text-brand-accent">DOITZ</span></h2>
          <div className="flex justify-center gap-1">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-500 fill-yellow-500 w-5 h-5" />
             ))}
          </div>
          <p className="text-slate-400 mt-4 text-sm font-medium">Note moyenne 5.0/5</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-dark border border-white/5 p-8 rounded-2xl relative group hover:border-brand-accent/30 transition-all duration-300 shadow-xl"
            >
              <Quote className="absolute top-6 right-6 text-white/5 group-hover:text-brand-accent/20 transition-colors" size={40} />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                    {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg font-display">{t.name}</h4>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">{t.role}</p>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <p className="text-slate-300 text-base leading-relaxed italic">"{t.quote}"</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-sm text-slate-500">{t.car}</span>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">{t.savings}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;