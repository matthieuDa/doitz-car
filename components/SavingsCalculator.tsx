import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const SavingsCalculator = () => {
  const [price, setPrice] = useState(35000);
  const [savings, setSavings] = useState(0);
  
  // Calculate savings (conservative estimate of 20%)
  useEffect(() => {
    const estimatedSavings = Math.round(price * 0.20);
    setSavings(estimatedSavings);
  }, [price]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  return (
    <section className="py-16 relative overflow-hidden border-y border-white/5 bg-brand-dark/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display tracking-tight">
            Simulez votre <span className="text-gradient">économie</span>
          </h2>
        </div>

        {/* Compact Card */}
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
              
              {/* Slider Input Side */}
              <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <label className="text-sm font-semibold text-blue-400 uppercase tracking-widest font-display">
                            Prix marché (France)
                        </label>
                        <span className="text-4xl font-bold text-white font-display tabular-nums">
                            {price.toLocaleString()} <span className="text-xl text-slate-500">€</span>
                        </span>
                    </div>
                    
                    <div className="relative h-2 bg-slate-800 rounded-full mb-2">
                        <div 
                            className="absolute h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                            style={{ width: `${((price - 15000) / (100000 - 15000)) * 100}%` }}
                        />
                        <input
                            type="range"
                            min="15000"
                            max="100000"
                            step="1000"
                            value={price}
                            onChange={handleSliderChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                            className="absolute h-5 w-5 bg-white rounded-full shadow-lg top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing border-2 border-brand-dark transition-transform hover:scale-110"
                            style={{ left: `${((price - 15000) / (100000 - 15000)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                        <span>15k</span>
                        <span>100k+</span>
                    </div>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <p className="text-xs text-slate-400 leading-relaxed">
                        <strong className="text-white">Note :</strong> 
                        Calcul basé sur une moyenne de 20%. Pour les modèles premium (Porsche, Audi RS), l'économie dépasse souvent 30%.
                    </p>
                </div>
              </div>

              {/* Result Side */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-xl animate-pulse-slow" />
                <div className="relative bg-[#050A14] border border-white/10 rounded-2xl p-6 text-center shadow-xl">
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-1.5 bg-green-500/10 rounded-lg">
                        <TrendingUp className="text-green-400" size={16} />
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Économie Estimée</p>
                  </div>

                  <motion.div 
                    key={savings}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6"
                  >
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter text-glow font-display tabular-nums whitespace-nowrap">
                         {savings.toLocaleString()} €
                    </span>
                  </motion.div>
                  
                  <div className="space-y-3 text-left border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Commission incluse</span>
                        <span className="text-slate-300 font-medium font-mono">2 700 €</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">ROI</span>
                        <span className="text-brand-gold font-bold font-display">x{(savings / 2700).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsCalculator;