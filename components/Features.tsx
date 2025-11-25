import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingDown, Clock, Globe } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-16 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight font-display">
            Pourquoi choisir <span className="text-gradient">DOITZ</span> ?
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Complexité transformée en opportunité. Simple. Sécurisé.
          </p>
        </div>

        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Card 1: Savings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-slate-800/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-brand-accent/30 group"
          >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <TrendingDown size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 font-display">Économies garanties</h3>
                    <p className="text-slate-400 text-sm leading-snug">
                    Accès direct prix marché Europe. Économisez 20% à 40% en coupant les intermédiaires.
                    </p>
                </div>
            </div>
          </motion.div>

          {/* Card 2: Security */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-green-500/30 group"
          >
             <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
             </div>
             <h3 className="text-lg font-bold text-white mb-1 font-display">Sécurité totale</h3>
             <p className="text-slate-400 text-xs">
                Inspection, historique vérifié, paiement sécurisé.
             </p>
          </motion.div>

          {/* Card 3: Sourcing */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-purple-500/30 group"
          >
             <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Globe size={20} />
             </div>
             <h3 className="text-lg font-bold text-white mb-1 font-display">Sourcing Europe</h3>
             <p className="text-slate-400 text-xs">
                Allemagne, Suède, Italie. Nous scannons tout.
             </p>
          </motion.div>

          {/* Card 4: Time (Wide at bottom) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 bg-slate-800/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 hover:border-indigo-500/30 group flex flex-col md:flex-row items-center gap-6"
          >
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 font-display">100 heures gagnées</h3>
                <p className="text-slate-400 text-sm">
                   Recherche, analyse, négociation, administration, transport. C'est un métier à temps plein. Nous le faisons pour vous, clé en main.
                </p>
              </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;