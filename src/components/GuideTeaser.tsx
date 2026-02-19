import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, BookOpen, Sparkles } from 'lucide-react';

const GuideTeaser = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const guideLink = "https://mattae.notion.site/Guide-complet-de-l-importation-de-v-hicules-trangers-2b32d6e3004d802aa702f83dac365ac1?source=copy_link";

  return (
    <section id="guide" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[2.5rem] p-8 md:p-20 overflow-visible border border-white/5 shadow-2xl group">
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-700 group-hover:opacity-75"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen transition-opacity duration-700 group-hover:opacity-75"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
                
                {/* Text Content */}
                <div className="md:w-1/2 order-2 md:order-1">
                    <span className="text-brand-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block flex items-center gap-2">
                        <Sparkles size={14} /> Ressource gratuite
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display leading-tight">
                        Le guide ultime de <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">l'importation</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                        Vous souhaitez comprendre les rouages de l'import avant de vous lancer ? J'ai rédigé un guide complet détaillant les taxes, les pièges à éviter et les astuces pour payer moins cher.
                    </p>
                    
                    <a 
                        href={guideLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-white text-brand-dark font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/10 hover:-translate-y-1 gap-2 group/btn"
                    >
                        Lire le guide complet
                        <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform"/>
                    </a>
                </div>

                {/* 3D Visual Book */}
                <div className="md:w-1/2 flex justify-center perspective-1000 order-1 md:order-2 h-[400px] items-center">
                    <motion.div 
                        style={{ y, rotateY: -30, rotateX: 10 }}
                        whileHover={{ rotateY: -15, rotateX: 0, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative w-[240px] h-[340px] transform-style-3d cursor-pointer"
                    >
                        {/* Front Cover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 rounded-r-md shadow-2xl flex flex-col items-center justify-between p-6 border-l-4 border-blue-950 transform-translate-z-25 z-20 overflow-hidden">
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
                            
                            <div className="w-full flex justify-between items-start z-10">
                                <span className="text-[10px] font-bold text-blue-200 tracking-widest uppercase">Édition 2025</span>
                                <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                                    <BookOpen size={14} className="text-white"/>
                                </div>
                            </div>

                            <div className="text-center z-10">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-brand-accent to-cyan-400 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                                <h3 className="text-3xl font-display font-bold text-white relative leading-none mb-1 drop-shadow-lg">
                                    GUIDE
                                </h3>
                                <p className="text-sm font-medium text-blue-100 relative tracking-wider">
                                    IMPORT AUTO
                                </p>
                            </div>

                            <div className="w-full text-center z-10 border-t border-white/20 pt-4">
                                <span className="text-[10px] font-bold text-white tracking-[0.3em]">DOITZ</span>
                            </div>
                        </div>

                        {/* Spine */}
                        <div className="absolute top-0 bottom-0 left-0 w-[50px] bg-blue-950 transform origin-left -rotate-y-90 rounded-l-sm flex items-center justify-center overflow-hidden">
                             <span className="text-white text-xs font-bold tracking-widest rotate-90 whitespace-nowrap opacity-80">DOITZ • GUIDE IMPORT</span>
                        </div>

                        {/* Pages (Thickness) */}
                        <div className="absolute top-2 bottom-2 right-0 w-[48px] bg-white transform origin-right -rotate-y-90 translate-x-[24px] translate-z-[-24px] shadow-inner">
                            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,#e5e7eb_2px)]"></div>
                        </div>
                        
                        {/* Back Cover */}
                        <div className="absolute inset-0 bg-blue-900 rounded-l-md transform -translate-z-50 shadow-xl"></div>

                        {/* Shadow Drop */}
                        <div className="absolute -bottom-12 left-4 right-4 h-8 bg-black/40 blur-xl transform rotate-x-90 translate-z-[-60px]"></div>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .transform-translate-z-25 { transform: translateZ(25px); }
        .transform-translate-z-50 { transform: translateZ(-25px); }
        .-rotate-y-90 { transform: rotateY(-90deg); }
        .rotate-x-90 { transform: rotateX(90deg); }
      `}</style>
    </section>
  );
};

export default GuideTeaser;