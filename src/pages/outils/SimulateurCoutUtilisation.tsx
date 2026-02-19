import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Calculator, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const FAQ_DATA = [
    { question: 'Comment calculer le vrai coût d\'une voiture par mois ?', answer: 'Le coût réel inclut 5 postes : la décote (perte de valeur), le carburant, l\'assurance, l\'entretien/pneus et les frais administratifs. La décote représente souvent 40-60% du coût total, bien devant le carburant — c\'est l\'erreur classique lors de l\'achat.' },
    { question: 'Combien coûte un véhicule neuf par mois en moyenne ?', answer: 'En France, le coût moyen de possession d\'une voiture neuve est d\'environ 500-700€/mois tout compris (décote + carburant + assurance + entretien). Un véhicule d\'occasion de 3-5 ans revient à 300-450€/mois grâce à une décote réduite.' },
    { question: 'Quelle est la durée de possession optimale ?', answer: 'Le sweet spot se situe généralement entre 3 et 6 ans. Avant 3 ans, la décote est trop forte (+20% par an). Au-delà de 6-7 ans, les coûts d\'entretien augmentent significativement. L\'idéal est d\'acheter un véhicule de 2-3 ans et le garder 4-5 ans.' },
    { question: 'La voiture électrique est-elle vraiment moins chère à l\'usage ?', answer: 'À l\'usage pur (carburant + entretien), oui : le coût en énergie est 3x inférieur et l\'entretien 30-40% moins cher (pas de vidange, moins de freins). Mais la décote reste élevée sur le neuf et les batteries vieillissent. L\'occasion électrique (2-3 ans) offre le meilleur rapport coût/usage.' },
    { question: 'Acheter ou louer : quel est le plus économique ?', answer: 'L\'achat comptant est le plus économique sur le long terme si vous gardez le véhicule 5 ans ou plus. La LOA/LLD convient si vous changez tous les 2-3 ans. Le crédit est un compromis : vous êtes propriétaire mais payez des intérêts. Simulez les 3 options avec notre outil de financement.' },
];

const SimulateurCoutUtilisation = () => {
    const [purchasePrice, setPurchasePrice] = useState(25000);
    const [vehicleAge, setVehicleAge] = useState(3);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [holdYears, setHoldYears] = useState(4);

    const [fuelType, setFuelType] = useState<'essence' | 'diesel' | 'electrique'>('essence');
    const [conso, setConso] = useState(6.5);
    const [fuelPrice, setFuelPrice] = useState(1.85);

    const [insuranceMonthly, setInsuranceMonthly] = useState(80);
    const [maintenanceYearly, setMaintenanceYearly] = useState(800);

    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const formatEuro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const results = useMemo(() => {
        // Décote : logarithmique — plus forte les premières années
        const decoteRate = (age: number) => {
            if (age <= 0) return 0;
            if (age === 1) return 0.25;
            if (age === 2) return 0.37;
            if (age === 3) return 0.47;
            if (age === 4) return 0.55;
            if (age === 5) return 0.62;
            return Math.min(0.62 + (age - 5) * 0.04, 0.85);
        };

        const valueAtStart = purchasePrice * (1 - decoteRate(vehicleAge));
        const valueAtEnd = purchasePrice * (1 - decoteRate(vehicleAge + holdYears));
        const decoteCost = Math.max(valueAtStart - valueAtEnd, 0);

        const totalKm = kmPerYear * holdYears;
        const fuelCost = fuelType === 'electrique'
            ? (totalKm / 100) * conso * fuelPrice
            : (totalKm / 100) * conso * fuelPrice;

        const insuranceCost = insuranceMonthly * 12 * holdYears;
        const maintenanceCost = maintenanceYearly * holdYears;
        const adminCost = 200 * holdYears; // CT, carte grise, etc.

        const totalCost = decoteCost + fuelCost + insuranceCost + maintenanceCost + adminCost;
        const costPerMonth = totalCost / (holdYears * 12);
        const costPerKm = totalCost / totalKm;

        return {
            decote: Math.round(decoteCost),
            fuel: Math.round(fuelCost),
            insurance: Math.round(insuranceCost),
            maintenance: Math.round(maintenanceCost),
            admin: Math.round(adminCost),
            total: Math.round(totalCost),
            perMonth: Math.round(costPerMonth),
            perKm: Math.round(costPerKm * 100) / 100,
            valueAtStart: Math.round(valueAtStart),
            valueAtEnd: Math.round(valueAtEnd),
            totalKm,
        };
    }, [purchasePrice, vehicleAge, kmPerYear, holdYears, fuelType, conso, fuelPrice, insuranceMonthly, maintenanceYearly]);

    const breakdown = [
        { label: 'Décote', amount: results.decote, color: 'bg-red-400', pct: results.decote / results.total * 100 },
        { label: 'Carburant / énergie', amount: results.fuel, color: 'bg-orange-400', pct: results.fuel / results.total * 100 },
        { label: 'Assurance', amount: results.insurance, color: 'bg-blue-400', pct: results.insurance / results.total * 100 },
        { label: 'Entretien / pneus', amount: results.maintenance, color: 'bg-green-400', pct: results.maintenance / results.total * 100 },
        { label: 'Frais admin', amount: results.admin, color: 'bg-slate-400', pct: results.admin / results.total * 100 },
    ];

    const pageUrl = `${SITE_URL}/outils/simulateur-cout-utilisation`;

    return (
        <>
            <SEO
                title="Simulateur Coût d'Utilisation Auto — Budget Réel par Mois"
                description="Calculez le vrai budget de votre voiture : décote + carburant + assurance + entretien. Découvrez ce que vous coûte réellement votre véhicule chaque mois."
                canonical={pageUrl}
                keywords={['coût utilisation voiture', 'budget auto mensuel', 'TCO voiture', 'décote voiture', 'coût possession automobile']}
                schema={[
                    generateWebApplicationSchema('Simulateur Coût d\'Utilisation — Budget Réel Auto', 'Calculez le vrai budget de votre voiture par mois : décote, carburant, assurance, entretien.', pageUrl, ['coût', 'utilisation', 'budget auto', 'décote', 'TCO']),
                    generateFAQSchema(FAQ_DATA),
                ]}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                    { name: 'Coût d\'Utilisation', url: pageUrl },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
                            <Wallet size={14} />
                            SIMULATEUR
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Le vrai <span className="text-gradient">coût de votre voiture</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Décote + carburant + assurance + entretien = le vrai budget auto. Pas la mensualité marketing, le coût réel.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="glass-panel rounded-3xl p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-display block mb-2">
                                    Prix d'achat : <span className="text-white text-lg">{purchasePrice.toLocaleString('fr-FR')} €</span>
                                </label>
                                <input type="range" min={5000} max={80000} step={500} value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-display block mb-2">
                                    Âge du véhicule : <span className="text-white text-lg">{vehicleAge} an{vehicleAge > 1 ? 's' : ''}</span>
                                </label>
                                <input type="range" min={0} max={15} value={vehicleAge}
                                    onChange={(e) => setVehicleAge(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-display block mb-2">
                                    Durée de possession : <span className="text-white text-lg">{holdYears} an{holdYears > 1 ? 's' : ''}</span>
                                </label>
                                <input type="range" min={1} max={10} value={holdYears}
                                    onChange={(e) => setHoldYears(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-display block mb-2">
                                    Kilométrage annuel : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')} km</span>
                                </label>
                                <input type="range" min={5000} max={50000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div className="border-t border-white/5 pt-5">
                                <label className="text-xs font-semibold text-purple-400 uppercase tracking-widest font-display block mb-2">Carburant</label>
                                <div className="flex gap-2 mb-3">
                                    {(['essence', 'diesel', 'electrique'] as const).map((f) => (
                                        <button key={f} onClick={() => {
                                            setFuelType(f);
                                            if (f === 'essence') { setConso(6.5); setFuelPrice(1.85); }
                                            if (f === 'diesel') { setConso(5.0); setFuelPrice(1.70); }
                                            if (f === 'electrique') { setConso(17); setFuelPrice(0.22); }
                                        }}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${fuelType === f ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Conso ({fuelType === 'electrique' ? 'kWh' : 'L'}/100km)</label>
                                        <input type="number" step={0.1} value={conso} onChange={(e) => setConso(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 block mb-1">Prix (€/{fuelType === 'electrique' ? 'kWh' : 'L'})</label>
                                        <input type="number" step={0.01} value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-5 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] text-slate-400 block mb-1">Assurance (€/mois)</label>
                                    <input type="number" value={insuranceMonthly} onChange={(e) => setInsuranceMonthly(Number(e.target.value))}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="text-[11px] text-slate-400 block mb-1">Entretien (€/an)</label>
                                    <input type="number" value={maintenanceYearly} onChange={(e) => setMaintenanceYearly(Number(e.target.value))}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-panel rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                                <Calculator size={20} className="text-purple-400" />
                                Bilan sur {holdYears} an{holdYears > 1 ? 's' : ''}
                            </h2>

                            {/* Key metrics */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="text-center p-3 bg-white/[0.02] rounded-xl">
                                    <div className="text-2xl font-bold text-gradient font-display tabular-nums">{formatEuro(results.perMonth)}</div>
                                    <div className="text-[11px] text-slate-400 mt-1">par mois</div>
                                </div>
                                <div className="text-center p-3 bg-white/[0.02] rounded-xl">
                                    <div className="text-2xl font-bold text-white font-display tabular-nums">{results.perKm.toFixed(2)}€</div>
                                    <div className="text-[11px] text-slate-400 mt-1">par km</div>
                                </div>
                                <div className="text-center p-3 bg-white/[0.02] rounded-xl">
                                    <div className="text-2xl font-bold text-white font-display tabular-nums">{formatEuro(results.total)}</div>
                                    <div className="text-[11px] text-slate-400 mt-1">total</div>
                                </div>
                            </div>

                            {/* Breakdown bars */}
                            <div className="space-y-3 mb-6">
                                {breakdown.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">{item.label}</span>
                                            <span className="text-white font-bold tabular-nums">{formatEuro(item.amount)} <span className="text-slate-500 text-xs">({Math.round(item.pct)}%)</span></span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.6 }}
                                                className={`h-full rounded-full ${item.color}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Value trajectory */}
                            <div className="p-3 bg-white/[0.02] rounded-xl mb-4">
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-slate-400">Valeur à l'achat</p>
                                        <p className="text-white font-bold">{formatEuro(results.valueAtStart)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <TrendingDown size={20} className="text-red-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400">Valeur à la revente</p>
                                        <p className="text-white font-bold">{formatEuro(results.valueAtEnd)}</p>
                                    </div>
                                </div>
                            </div>

                            {results.decote > results.fuel * 2 && (
                                <div className="p-3 bg-amber-500/10 rounded-xl">
                                    <p className="text-xs text-amber-300">💡 La décote représente {Math.round(results.decote / results.total * 100)}% de votre budget — plus que le carburant ! Envisagez un véhicule d'occasion pour réduire ce poste.</p>
                                </div>
                            )}

                            <div className="mt-6 space-y-2">
                                <Link to="/blog/achat-neuf-vs-occasion" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Neuf vs Occasion : le vrai comparatif
                                </Link>
                                <Link to="/outils/calculateur-decote" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Calculateur de décote détaillé
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
                                        {faqOpen === i ? <ChevronUp size={18} className="text-purple-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
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

export default SimulateurCoutUtilisation;
