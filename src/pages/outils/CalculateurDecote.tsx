import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const FAQ_DATA = [
    { question: 'Qu\'est-ce que la décote automobile ?', answer: 'La décote est la perte de valeur d\'un véhicule au fil du temps. Un véhicule neuf perd en moyenne 25% de sa valeur dès la première année, puis 15% la deuxième et environ 10% les années suivantes. Après 5 ans, un véhicule a perdu 50 à 65% de sa valeur neuve.' },
    { question: 'Quel est le meilleur âge pour acheter une voiture d\'occasion ?', answer: 'Le sweet spot se situe entre 2 et 4 ans. À cet âge, le véhicule a déjà subi la décote la plus forte (30-55%), il est souvent encore sous garantie constructeur, et le kilométrage reste raisonnable. Vous payez 45-70% du prix neuf pour un véhicule quasi-neuf.' },
    { question: 'Quels véhicules décotent le moins ?', answer: 'Les segments premium (Porsche, Mercedes AMG), les SUV populaires (Peugeot 3008, Dacia Duster) et les utilitaires conservent le mieux leur valeur. Les citadines et berlines de segment B/C décotent le plus vite. Les électriques décotent encore fortement à cause de l\'évolution rapide de la technologie.' },
    { question: 'Comment calculer la valeur de revente résiduelle ?', answer: 'La valeur résiduelle = prix neuf × (1 - taux de décote cumulé). Le taux dépend du segment, du kilométrage et de l\'état. Notre simulateur utilise des coefficients par segment et ajuste selon le kilométrage annuel pour donner une estimation précise.' },
    { question: 'Le kilométrage influence-t-il la décote ?', answer: 'Oui significativement. Un véhicule roulant 25 000 km/an au lieu de 15 000 km/an perd environ 10-15% de valeur supplémentaire. Au-delà de 150 000 km totaux, la décote s\'accélère car les coûts d\'entretien augmentent et la confiance de l\'acheteur diminue.' },
];

const segments: Record<string, { label: string; rates: number[] }> = {
    citadine: { label: 'Citadine (Clio, 208…)', rates: [0.27, 0.40, 0.50, 0.58, 0.64, 0.69, 0.73, 0.76, 0.79, 0.81] },
    compacte: { label: 'Compacte (308, Golf…)', rates: [0.25, 0.38, 0.48, 0.56, 0.62, 0.67, 0.71, 0.74, 0.77, 0.80] },
    suv: { label: 'SUV (3008, Tucson…)', rates: [0.22, 0.34, 0.44, 0.52, 0.58, 0.63, 0.67, 0.71, 0.74, 0.77] },
    berline: { label: 'Berline (Classe C, A4…)', rates: [0.28, 0.42, 0.52, 0.60, 0.66, 0.71, 0.75, 0.78, 0.80, 0.83] },
    premium: { label: 'Premium (Porsche, AMG…)', rates: [0.18, 0.28, 0.36, 0.43, 0.49, 0.54, 0.59, 0.63, 0.67, 0.70] },
    utilitaire: { label: 'Utilitaire (Berlingo, Transit…)', rates: [0.20, 0.32, 0.42, 0.50, 0.56, 0.61, 0.65, 0.69, 0.72, 0.75] },
};

const CalculateurDecote = () => {
    const [priceNeuf, setPriceNeuf] = useState(35000);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [segment, setSegment] = useState<string>('compacte');
    const [maxYears, setMaxYears] = useState(10);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const fmt = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const data = useMemo(() => {
        const s = segments[segment];
        const kmAdjustment = (kmPerYear - 15000) / 15000 * 0.05;

        return Array.from({ length: maxYears }, (_, i) => {
            const year = i + 1;
            const baseRate = s.rates[Math.min(i, s.rates.length - 1)];
            const adjustedRate = Math.min(baseRate + kmAdjustment * year, 0.90);
            const value = Math.round(priceNeuf * (1 - adjustedRate));
            const decoteThisYear = i === 0
                ? Math.round(priceNeuf * adjustedRate)
                : Math.round(priceNeuf * (1 - (s.rates[Math.min(i - 1, s.rates.length - 1)] + kmAdjustment * (year - 1)))) - value;
            return {
                year,
                value: Math.max(value, 0),
                totalDecote: Math.round(priceNeuf - Math.max(value, 0)),
                decoteThisYear: Math.max(decoteThisYear, 0),
                rate: Math.round(adjustedRate * 100),
                km: kmPerYear * year,
            };
        });
    }, [priceNeuf, kmPerYear, segment, maxYears]);

    const maxValue = priceNeuf;
    const sweetSpot = data.reduce((best, row, i) => {
        if (i === 0) return best;
        const yearlyDecote = row.decoteThisYear;
        if (yearlyDecote < best.decote) return { year: row.year, decote: yearlyDecote };
        return best;
    }, { year: 1, decote: Infinity });

    const pageUrl = `${SITE_URL}/outils/calculateur-decote`;

    return (
        <>
            <SEO
                title="Calculateur Décote Auto — Perte de Valeur Année par Année"
                description="Visualisez la perte de valeur de votre véhicule année par année. Simulez la décote par segment : citadine, SUV, premium, utilitaire. Trouvez le meilleur âge d'achat."
                canonical={pageUrl}
                keywords={['décote voiture', 'perte de valeur auto', 'calculateur décote', 'valeur résiduelle', 'meilleur âge achat voiture']}
                schema={[
                    generateWebApplicationSchema('Calculateur Décote Automobile', 'Visualisez la perte de valeur de votre véhicule année par année. Calculateur gratuit par segment.', pageUrl, ['décote', 'perte valeur', 'résiduel', 'automobile']),
                    generateFAQSchema(FAQ_DATA),
                ]}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                    { name: 'Calculateur Décote', url: pageUrl },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-4">
                            <TrendingDown size={14} />
                            CALCULATEUR
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Calculateur de <span className="text-gradient">décote</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Visualisez la perte de valeur de votre véhicule année par année. Trouvez le sweet spot d'achat.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Inputs */}
                        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-red-400 uppercase tracking-widest font-display block mb-2">Segment</label>
                                <select value={segment} onChange={(e) => setSegment(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-red-500 focus:outline-none">
                                    {Object.entries(segments).map(([key, s]) => (
                                        <option key={key} value={key}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-red-400 uppercase tracking-widest font-display block mb-2">
                                    Prix neuf : <span className="text-white text-lg">{priceNeuf.toLocaleString('fr-FR')} €</span>
                                </label>
                                <input type="range" min={10000} max={100000} step={1000} value={priceNeuf}
                                    onChange={(e) => setPriceNeuf(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-red-400 uppercase tracking-widest font-display block mb-2">
                                    km/an : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')}</span>
                                </label>
                                <input type="range" min={5000} max={40000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                            </div>

                            {sweetSpot.year > 1 && (
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <p className="text-xs text-green-300 flex items-start gap-2">
                                        <Info size={14} className="shrink-0 mt-0.5" />
                                        Sweet spot : l'année <strong>{sweetSpot.year}</strong> a la décote annuelle la plus faible. Acheter à cet âge optimise votre investissement.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Chart */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-3 glass-panel rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                                <Calculator size={20} className="text-red-400" />
                                Évolution de la valeur
                            </h2>

                            {/* Visual bar chart */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-10 text-slate-500 text-right">Neuf</span>
                                    <div className="flex-1 bg-white/5 rounded-full h-7 relative overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '100%' }} />
                                        <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white font-bold">{fmt(priceNeuf)}</span>
                                    </div>
                                </div>
                                {data.map((row) => {
                                    const width = Math.max((row.value / maxValue) * 100, 5);
                                    const isSweetSpot = row.year === sweetSpot.year;
                                    return (
                                        <div key={row.year} className="flex items-center gap-3 text-sm">
                                            <span className="w-10 text-slate-500 text-right">{row.year} an{row.year > 1 ? 's' : ''}</span>
                                            <div className="flex-1 bg-white/5 rounded-full h-7 relative overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }}
                                                    transition={{ duration: 0.5, delay: row.year * 0.05 }}
                                                    className={`h-full rounded-full ${isSweetSpot ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-red-500/80 to-orange-400/80'}`} />
                                                <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white font-bold">
                                                    {fmt(row.value)} <span className="text-white/50 ml-1">(-{row.rate}%)</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detailed table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="p-2 text-left text-slate-400">Année</th>
                                            <th className="p-2 text-right text-slate-400">Valeur</th>
                                            <th className="p-2 text-right text-slate-400">Décote/an</th>
                                            <th className="p-2 text-right text-slate-400">Total perdu</th>
                                            <th className="p-2 text-right text-slate-400">km total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row) => (
                                            <tr key={row.year} className={`border-b border-white/5 ${row.year === sweetSpot.year ? 'bg-green-500/5' : ''}`}>
                                                <td className="p-2 text-white font-medium">{row.year} an{row.year > 1 ? 's' : ''}</td>
                                                <td className="p-2 text-right text-white font-bold tabular-nums">{fmt(row.value)}</td>
                                                <td className="p-2 text-right text-red-400 tabular-nums">{fmt(row.decoteThisYear)}</td>
                                                <td className="p-2 text-right text-slate-400 tabular-nums">{fmt(row.totalDecote)}</td>
                                                <td className="p-2 text-right text-slate-500 tabular-nums">{row.km.toLocaleString('fr-FR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Link to="/outils/simulateur-cout-utilisation" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Calculer le coût total de possession
                                </Link>
                                <Link to="/blog/decote-voiture-calculer" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Guide complet sur la décote automobile
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white font-display mb-6">Questions fréquentes</h2>
                        <div className="space-y-3">
                            {FAQ_DATA.map((faq, i) => (
                                <div key={i} className="glass-panel rounded-2xl overflow-hidden">
                                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left">
                                        <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
                                        {faqOpen === i ? <ChevronUp size={18} className="text-red-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                    </button>
                                    {faqOpen === i && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5">
                                            <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalculateurDecote;
