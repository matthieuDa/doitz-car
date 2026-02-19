import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, FileText, Fuel, Wallet, ArrowRight, ArrowLeft, Car, TrendingDown } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const tools = [
    {
        slug: 'simulateur-financement',
        title: 'Simulateur LLD vs LOA vs Crédit',
        description: 'Comparez les 5 modes de financement sur votre véhicule : LOA, LLD, crédit neuf, comptant et occasion. Le vrai coût, pas la mensualité marketing.',
        icon: <Calculator size={24} />,
        color: 'blue',
        keywords: ['LOA', 'LLD', 'Crédit auto', 'Financement'],
    },
    {
        slug: 'simulateur-carte-grise',
        title: 'Simulateur Carte Grise',
        description: 'Calculez le prix exact de votre carte grise par région : taxe régionale, malus CO2, frais de gestion. Import inclus.',
        icon: <FileText size={24} />,
        color: 'green',
        keywords: ['Carte grise', 'Malus CO2', 'Immatriculation'],
    },
    {
        slug: 'simulateur-carburant',
        title: 'Diesel vs Essence vs Électrique',
        description: 'Essence, diesel, hybride ou électrique : quel carburant est le plus économique pour votre kilométrage ? Coût au km et CO2 comparés.',
        icon: <Fuel size={24} />,
        color: 'orange',
        keywords: ['Carburant', 'Diesel vs Essence', 'Électrique'],
    },
    {
        slug: 'simulateur-cout-utilisation',
        title: 'Simulateur Coût d\'Utilisation',
        description: 'Le vrai budget auto : décote + carburant + assurance + entretien + pneus. Combien vous coûte réellement votre voiture par mois ?',
        icon: <Wallet size={24} />,
        color: 'purple',
        keywords: ['Budget auto', 'Coût possession', 'TCO'],
    },
    {
        slug: 'comparateur-vehicules',
        title: 'Comparateur de Véhicules',
        description: 'Comparez jusqu\'à 5 véhicules côte à côte : prix neuf, prix occasion, conso, coffre, fiabilité. Style Apple.',
        icon: <Car size={24} />,
        color: 'cyan',
        keywords: ['Comparateur', 'Véhicules', 'Côte à côte'],
    },
    {
        slug: 'calculateur-decote',
        title: 'Calculateur Décote',
        description: 'Visualisez la perte de valeur de votre véhicule année par année. Trouvez le sweet spot pour acheter au bon âge.',
        icon: <TrendingDown size={24} />,
        color: 'red',
        keywords: ['Décote', 'Perte valeur', 'Argus'],
    },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/10' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', glow: 'shadow-green-500/10' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/10' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/10' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/10' },
};

const OutilsIndex = () => {
    return (
        <>
            <SEO
                title="Outils Auto Gratuits — Simulateurs Doitz"
                description="Simulateurs auto gratuits : financement LOA/LLD/Crédit, carte grise, coût carburant, décote, comparateur véhicules. Prenez les meilleures décisions pour votre véhicule."
                canonical={`${SITE_URL}/outils`}
                keywords={['simulateur auto', 'outils gratuits voiture', 'calculateur carte grise', 'comparateur véhicules', 'coût voiture']}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour à l'accueil
                    </Link>

                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Calculator size={14} />
                            OUTILS GRATUITS
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display tracking-tight">
                            Vos <span className="text-gradient">outils d'aide à la décision</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Des simulateurs conçus pour le consommateur. Pas de marketing, que des vrais chiffres pour prendre les meilleures décisions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {tools.map((tool, i) => {
                            const c = colorMap[tool.color];
                            return (
                                <motion.div
                                    key={tool.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={`/outils/${tool.slug}`}
                                        className={`block glass-panel rounded-2xl p-6 border ${c.border} hover:shadow-lg ${c.glow} transition-all hover:-translate-y-1 group`}
                                    >
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.bg} ${c.text} mb-4`}>
                                            {tool.icon}
                                        </div>
                                        <h2 className="text-xl font-bold text-white font-display mb-2 group-hover:text-blue-400 transition-colors">
                                            {tool.title}
                                        </h2>
                                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                                            {tool.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tool.keywords.map((kw) => (
                                                <span key={kw} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-slate-400">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${c.text} group-hover:gap-2 transition-all`}>
                                            Utiliser l'outil <ArrowRight size={14} />
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white font-display mb-2">
                            Besoin d'un accompagnement personnalisé ?
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Nos conseillers analysent votre situation et vous recommandent la meilleure stratégie : véhicule + financement + import.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transform hover:-translate-y-0.5"
                        >
                            Décrivez votre projet →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OutilsIndex;
