import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Page introuvable | DOITZ</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <section className="min-h-screen flex items-center justify-center px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-xl mx-auto"
                >
                    {/* Big 404 */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                        className="mb-8"
                    >
                        <span className="text-[120px] md:text-[180px] font-black font-display bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent leading-none select-none">
                            404
                        </span>
                    </motion.div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white font-display mb-4">
                        Oups, cette page n'existe pas
                    </h1>
                    <p className="text-slate-400 mb-10 text-lg">
                        La page que vous cherchez a peut-être été déplacée, supprimée, ou n'a jamais existé. Pas de panique !
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
                        >
                            <Home size={18} />
                            Retour à l'accueil
                        </Link>
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-panel text-slate-300 hover:text-white font-semibold transition-all hover:scale-105"
                        >
                            <Search size={18} />
                            Nos articles
                        </Link>
                        <Link
                            to="/outils"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-panel text-slate-300 hover:text-white font-semibold transition-all hover:scale-105"
                        >
                            <ArrowLeft size={18} />
                            Nos outils
                        </Link>
                    </div>

                    {/* Helpful links */}
                    <div className="mt-16 glass-panel rounded-2xl p-6 text-left">
                        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 font-display">
                            Pages populaires
                        </h2>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/outils/simulateur-financement" className="text-slate-400 hover:text-blue-400 transition-colors">
                                    → Simulateur de financement (LOA / LLD / Crédit)
                                </Link>
                            </li>
                            <li>
                                <Link to="/outils/comparateur-vehicules" className="text-slate-400 hover:text-blue-400 transition-colors">
                                    → Comparateur de véhicules (34 modèles)
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/acheter-voiture-occasion-europe" className="text-slate-400 hover:text-blue-400 transition-colors">
                                    → Guide : Acheter une voiture d'occasion en Europe
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/courtier-auto-avantages" className="text-slate-400 hover:text-blue-400 transition-colors">
                                    → Pourquoi passer par un courtier auto ?
                                </Link>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default NotFound;
