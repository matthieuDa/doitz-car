import React from 'react';
import { motion } from 'framer-motion';
import { Check, Search, BadgeEuro, Key } from 'lucide-react';

const Process = () => {
  return (
    <section id="process" className="py-24 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            
            {/* Left Side: Redesigned Journey Visualization */}
            <div className="md:w-1/2 w-full relative">
                {/* Visual Container */}
                <div className="relative pl-4">
                    {/* Connecting Line */}
                    <div className="absolute left-[3.5rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent"></div>

                    {/* Step 1 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex items-center gap-6 mb-12 group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-white/10 shadow-lg flex items-center justify-center relative z-10 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                            <Search className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 rounded-xl flex-1 hover:bg-white/[0.05] transition-colors hover:border-white/10">
                            <h4 className="text-lg font-bold text-white font-display">Définition et chasse</h4>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">Analyse du besoin, sourcing Europe, sélection des meilleures opportunités.</p>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative flex items-center gap-6 mb-12 group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-white/10 shadow-lg flex items-center justify-center relative z-10 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
                            <BadgeEuro className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 rounded-xl flex-1 hover:bg-white/[0.05] transition-colors hover:border-white/10">
                            <h4 className="text-lg font-bold text-white font-display">Expertise et négociation</h4>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">Contrôle technique, vérification administrative, sécurisation du prix.</p>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative flex items-center gap-6 group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-300">
                            <Key className="text-white" size={24} />
                        </div>
                        <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 p-5 rounded-xl flex-1">
                            <h4 className="text-lg font-bold text-white font-display">Clés en main</h4>
                            <p className="text-blue-200/70 text-sm mt-1 leading-relaxed">Rapatriement, immatriculation WW puis définitive. Vous roulez.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Copy */}
            <div className="md:w-1/2 space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                    L'importation,<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">c'est notre métier.</span>
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed font-light">
                    Vous pensez que l'importation est risquée ou compliquée ? Avec nous, vous avez un <strong className="text-white font-medium">architecte automobile dédié</strong>. 
                </p>
                
                <p className="text-slate-400 leading-relaxed text-sm">
                    Nous sécurisons chaque étape, du premier contact avec le vendeur étranger jusqu'à la pose de vos plaques définitives. Profitez de votre nouveau véhicule, nous gérons tout le reste.
                </p>

                <ul className="space-y-4 pt-4">
                    <li className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Check size={14} />
                        </div>
                        <span className="text-slate-200 text-sm">Pas de barrière de la langue</span>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Check size={14} />
                        </div>
                        <span className="text-slate-200 text-sm">Pas de surprise sur la TVA</span>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Check size={14} />
                        </div>
                        <span className="text-slate-200 text-sm">Véhicules garantis</span>
                    </li>
                </ul>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Process;