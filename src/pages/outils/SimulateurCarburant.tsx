import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Fuel, Zap, Leaf, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const FAQ_DATA = [
    { question: 'Diesel ou essence : lequel est le plus économique en 2026 ?', answer: 'Cela dépend de votre kilométrage annuel. Le diesel devient plus économique à partir d\'environ 20 000 km/an grâce à sa consommation plus faible. En dessous de 15 000 km/an, l\'essence est généralement plus rentable car le prix au litre est compensé par l\'écart de prix à l\'achat.' },
    { question: 'Quel est le coût au km d\'une voiture électrique ?', answer: 'En moyenne, une voiture électrique coûte entre 2 et 3 centimes par km en énergie (recharge à domicile), contre 8 à 12 centimes pour un véhicule thermique. Même en comptant les recharges rapides (plus chères), l\'électrique reste 2 à 3 fois moins cher au kilomètre.' },
    { question: 'L\'hybride vaut-il le coup ?', answer: 'L\'hybride (non-rechargeable) offre un bon compromis pour les trajets mixtes ville/route. L\'hybride rechargeable (PHEV) est intéressant si vous rechargez quotidiennement et faites moins de 50 km/jour en électrique. Au-delà, le surpoids du véhicule augmente la consommation thermique.' },
    { question: 'Le GPL est-il encore avantageux ?', answer: 'Oui — le GPL coûte environ 0.95€/L (2024) et bénéficie d\'avantages fiscaux. Cependant, la surconsommation de 15-20% et la perte de volume de coffre sont à considérer. C\'est surtout intéressant pour les gros rouleurs (> 20 000 km/an).' },
    { question: 'Comment réduire sa consommation de carburant ?', answer: 'Les principaux leviers sont : l\'éco-conduite (jusqu\'à -20%), le bon gonflage des pneus (-3% par 0.5 bar), limiter la climatisation, et éviter les surcharges. Sur autoroute, rouler à 120 km/h au lieu de 130 km/h économise environ 1L/100km.' },
];

const SimulateurCarburant = () => {
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [years, setYears] = useState(5);
    const [prixEssence, setPrixEssence] = useState(1.85);
    const [prixDiesel, setPrixDiesel] = useState(1.70);
    const [prixElectricite, setPrixElectricite] = useState(0.22);
    const [prixGPL, setPrixGPL] = useState(0.95);

    const [consoEssence, setConsoEssence] = useState(7.0);
    const [consoDiesel, setConsoDiesel] = useState(5.5);
    const [consoHybride, setConsoHybride] = useState(4.5);
    const [consoElec, setConsoElec] = useState(17);
    const [consoGPL, setConsoGPL] = useState(9.5);

    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const formatEuro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const results = useMemo(() => {
        const totalKm = kmPerYear * years;
        const essence = (totalKm / 100) * consoEssence * prixEssence;
        const diesel = (totalKm / 100) * consoDiesel * prixDiesel;
        const hybride = (totalKm / 100) * consoHybride * prixEssence;
        const electrique = (totalKm / 100) * consoElec * prixElectricite;
        const gpl = (totalKm / 100) * consoGPL * prixGPL;

        const list = [
            { label: 'Essence', cost: essence, icon: '⛽', color: 'text-orange-400', bg: 'bg-orange-400/10', co2: Math.round(consoEssence * 23.2 * totalKm / 1000) },
            { label: 'Diesel', cost: diesel, icon: '🛢️', color: 'text-yellow-400', bg: 'bg-yellow-400/10', co2: Math.round(consoDiesel * 26.4 * totalKm / 1000) },
            { label: 'Hybride', cost: hybride, icon: '🔋', color: 'text-green-400', bg: 'bg-green-400/10', co2: Math.round(consoHybride * 23.2 * totalKm / 1000) },
            { label: 'Électrique', cost: electrique, icon: '⚡', color: 'text-cyan-400', bg: 'bg-cyan-400/10', co2: 0 },
            { label: 'GPL', cost: gpl, icon: '🟢', color: 'text-emerald-400', bg: 'bg-emerald-400/10', co2: Math.round(consoGPL * 17.1 * totalKm / 1000) },
        ].sort((a, b) => a.cost - b.cost);

        return { list, totalKm, cheapest: list[0], mostExpensive: list[list.length - 1] };
    }, [kmPerYear, years, prixEssence, prixDiesel, prixElectricite, prixGPL, consoEssence, consoDiesel, consoHybride, consoElec, consoGPL]);

    const savings = results.mostExpensive.cost - results.cheapest.cost;
    const pageUrl = `${SITE_URL}/outils/simulateur-carburant`;

    return (
        <>
            <SEO
                title="Diesel vs Essence vs Électrique — Simulateur Carburant 2026"
                description="Quel carburant est le plus économique ? Comparez le coût réel diesel, essence, hybride, électrique et GPL selon votre kilométrage. Calculateur gratuit avec prix personnalisables."
                canonical={pageUrl}
                keywords={['diesel vs essence', 'simulateur carburant', 'coût carburant', 'électrique vs thermique', 'GPL', 'comparatif énergie voiture']}
                schema={[
                    generateWebApplicationSchema('Simulateur Carburant — Diesel vs Essence vs Électrique', 'Comparez le coût réel diesel, essence, hybride, électrique et GPL selon votre kilométrage annuel.', pageUrl, ['diesel', 'essence', 'électrique', 'GPL', 'carburant', 'coût']),
                    generateFAQSchema(FAQ_DATA),
                ]}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                    { name: 'Diesel vs Essence vs Électrique', url: pageUrl },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4">
                            <Fuel size={14} />
                            COMPARATEUR
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Diesel vs Essence vs <span className="text-gradient">Électrique</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Comparez le coût réel en carburant sur plusieurs années. Prix, consommation et CO2 personnalisables.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="glass-panel rounded-3xl p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-orange-400 uppercase tracking-widest font-display block mb-2">
                                    Kilométrage annuel : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')} km</span>
                                </label>
                                <input type="range" min={5000} max={60000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-orange-400 uppercase tracking-widest font-display block mb-2">
                                    Durée de possession : <span className="text-white text-lg">{years} ans</span>
                                </label>
                                <input type="range" min={1} max={10} value={years}
                                    onChange={(e) => setYears(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div className="border-t border-white/5 pt-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Prix au litre / kWh</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Essence (€/L)</label>
                                        <input type="number" step={0.01} value={prixEssence} onChange={(e) => setPrixEssence(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Diesel (€/L)</label>
                                        <input type="number" step={0.01} value={prixDiesel} onChange={(e) => setPrixDiesel(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Électricité (€/kWh)</label>
                                        <input type="number" step={0.01} value={prixElectricite} onChange={(e) => setPrixElectricite(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">GPL (€/L)</label>
                                        <input type="number" step={0.01} value={prixGPL} onChange={(e) => setPrixGPL(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Consommation moyenne</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Essence (L/100km)</label>
                                        <input type="number" step={0.1} value={consoEssence} onChange={(e) => setConsoEssence(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Diesel (L/100km)</label>
                                        <input type="number" step={0.1} value={consoDiesel} onChange={(e) => setConsoDiesel(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Hybride (L/100km)</label>
                                        <input type="number" step={0.1} value={consoHybride} onChange={(e) => setConsoHybride(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Électrique (kWh/100km)</label>
                                        <input type="number" step={0.5} value={consoElec} onChange={(e) => setConsoElec(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">GPL (L/100km)</label>
                                        <input type="number" step={0.1} value={consoGPL} onChange={(e) => setConsoGPL(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-panel rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                                <Calculator size={20} className="text-orange-400" />
                                Coût carburant sur {years} an{years > 1 ? 's' : ''} — {results.totalKm.toLocaleString('fr-FR')} km
                            </h2>

                            <div className="space-y-3">
                                {results.list.map((item, i) => {
                                    const barWidth = (item.cost / results.mostExpensive.cost) * 100;
                                    return (
                                        <div key={item.label} className={`rounded-xl p-4 ${i === 0 ? 'border-2 border-green-500/30 bg-green-500/5' : 'bg-white/[0.02]'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
                                                    {i === 0 && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">LE + ÉCONOMIQUE</span>}
                                                </div>
                                                <span className="text-white font-bold tabular-nums">{formatEuro(item.cost)}</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                                    className={`h-full rounded-full ${item.bg.replace('/10', '/50')}`} />
                                            </div>
                                            <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>{formatEuro(item.cost / years)}/an</span>
                                                <span>{formatEuro(item.cost / (years * 12))}/mois</span>
                                                <span>{item.co2 > 0 ? `${item.co2.toLocaleString('fr-FR')} kg CO2` : '0 émission'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {savings > 500 && (
                                <div className="mt-4 p-3 bg-green-500/10 rounded-xl">
                                    <p className="text-sm text-green-300">
                                        💡 En choisissant <strong>{results.cheapest.label}</strong> plutôt que <strong>{results.mostExpensive.label}</strong>, vous économisez <strong>{formatEuro(savings)}</strong> en carburant sur {years} ans.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 space-y-2">
                                <Link to="/blog/diesel-vs-essence" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Diesel vs Essence : guide complet 2026
                                </Link>
                                <Link to="/blog/electrique-vs-thermique" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Électrique vs Thermique : le vrai comparatif
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
                                        {faqOpen === i ? <ChevronUp size={18} className="text-orange-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
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

export default SimulateurCarburant;
