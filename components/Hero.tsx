import React, { useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, BookOpen, TrendingDown, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenForm: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenForm }) => {
  const guideLink = "https://mattae.notion.site/Guide-complet-de-l-importation-de-v-hicules-trangers-2b32d6e3004d802aa702f83dac365ac1?source=copy_link";

  // 3D Tilt Logic
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const springConfig = { damping: 20, stiffness: 100 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  React.useEffect(() => {
    springRotateX.set(rotateX);
    springRotateY.set(rotateY);
  }, [rotateX, rotateY, springRotateX, springRotateY]);


  return (
    <section className="relative min-h-screen flex items-center pt-20 md:pt-28 pb-16 md:pb-20 overflow-hidden">
      
      {/* Cyber Grid Floor */}
      <div className="cyber-grid"></div>

      {/* Ambient Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-300 text-xs font-bold tracking-[0.2em] uppercase font-display">
                    Importation simplifiée
                </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight font-display drop-shadow-2xl">
              Votre véhicule <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">de rêve.</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Au vrai prix.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
              DOITZ gère l'importation de A à Z. <br className="hidden md:block"/>
              Économisez jusqu'à 30% sans vous soucier des formalités.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <button 
                onClick={onOpenForm}
                className="w-full sm:w-auto px-8 py-5 bg-brand-accent text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-1"
              >
                <span>Démarrer ma recherche</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a 
                href={guideLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-5 text-slate-300 hover:text-white font-medium text-lg transition-colors flex items-center justify-center gap-2 border border-white/10 rounded-xl hover:bg-white/5 backdrop-blur-sm group"
              >
                <BookOpen size={20} className="text-slate-500 group-hover:text-white transition-colors"/>
                <span>Voir le guide</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start border-t border-white/5 pt-6">
                <div className="text-left">
                    <p className="text-2xl font-bold text-white font-display">100%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Sécurisé</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10"></div>
                <div className="text-left">
                    <p className="text-2xl font-bold text-white font-display">-30%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Économie max</p>
                </div>
                 <div className="w-[1px] h-10 bg-white/10"></div>
                <div className="text-left">
                    <p className="text-2xl font-bold text-white font-display">48h</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Réponse</p>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - 3D Card */}
        <div className="hidden lg:block perspective-1000">
           <motion.div 
              style={{ rotateX: springRotateX, rotateY: springRotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-[#0F172A] to-[#020617] backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center cursor-pointer group transform-gpu overflow-hidden"
           >
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Abstract Car Graphic */}
              <div className="relative z-10 w-[80%]">
                 <svg viewBox="0 0 400 200" className="w-full drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                    <defs>
                        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <path 
                        d="M20,150 L380,150 L380,140 Q380,110 350,110 L300,110 L260,50 L140,50 L110,110 L80,110 Q60,110 60,140 Z" 
                        fill="none" 
                        stroke="url(#neonGradient)" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        className="animate-[pulse_4s_ease-in-out_infinite]"
                    />
                    {/* Stylized Wheels */}
                    <circle cx="90" cy="150" r="22" fill="transparent" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />
                    <circle cx="310" cy="150" r="22" fill="transparent" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />
                    <circle cx="90" cy="150" r="8" fill="#3B82F6" opacity="0.5" />
                    <circle cx="310" cy="150" r="8" fill="#3B82F6" opacity="0.5" />
                </svg>
              </div>

              {/* Floating Badge 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 p-2 rounded-xl text-green-400">
                          <TrendingDown size={24} />
                      </div>
                      <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Économie</p>
                          <p className="text-xl font-bold text-white">- 30%</p>
                      </div>
                  </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl"
              >
                  <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                          <ShieldCheck size={24} />
                      </div>
                      <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Garantie</p>
                          <p className="text-xl font-bold text-white">Sécurisé</p>
                      </div>
                  </div>
              </motion.div>

           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;