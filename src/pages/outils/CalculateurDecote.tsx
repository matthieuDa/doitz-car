import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, Calculator, Info } from 'lucide-react';

const CalculateurDecote = () => {
    const [priceNeuf, setPriceNeuf] = useState(35000);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [segment, setSegment] = useState<'citadine' | 'compacte' | 'suv' | 'berline' | 'premium' | 'utilitaire'>('compacte');
    const [motorisation, setMotorisation] = useState<'essence' | 'diesel' | 'hybride' | 'electrique'>('essence');
    const [marque, setMarque] = useState<'francaise' | 'allemande' | 'japonaise' | 'coreenne' | 'americaine'>('francaise');

    const results = useMemo(() => {
        /* Depreciation rates by year — adjusted per segment, motor, brand */
        const baseRates = [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03]; // 10 years

        // Segment factor
        const segFactors: Record<string, number> = {
            citadine: 1.05, compacte: 1.0, suv: 0.90, berline: 1.02, premium: 0.85, utilitaire: 0.88
        };
        // Motorisation factor
        const motFactors: Record<string, number> = {
            essence: 1.0, diesel: 1.15, hybride: 0.92, electrique: 1.20
        };
        // Brand factor (retention)
        const brandFactors: Record<string, number> = {
            francaise: 1.08, allemande: 0.90, japonaise: 0.85, coreenne: 0.95, americaine: 1.0
        };

        const sf = segFactors[segment];
        const mf = motFactors[motorisation];
        const bf = brandFactors[marque];

        // Kilométrage factor: high mileage accelerates depreciation
        const kmFactor = kmPerYear <= 10000 ? 0.90
            : kmPerYear <= 15000 ? 1.0
                : kmPerYear <= 20000 ? 1.08
                    : kmPerYear <= 30000 ? 1.18
                        : 1.30;

        // ZFE penalty for diesel (accelerated depreciation in urban markets)
        const zfeFactor = motorisation === 'diesel' ? 1.10 : 1.0;

        const years: { year: number; rate: number; value: number; loss: number; totalLoss: number; pctRetained: number }[] = [];
        let totalLoss = 0;

        for (let i = 0; i < 10; i++) {
            const adjRate = Math.min(baseRates[i] * sf * mf * bf * kmFactor * zfeFactor, 0.40);
            const loss = Math.round(priceNeuf * adjRate);
            totalLoss += loss;
            const value = Math.max(priceNeuf - totalLoss, Math.round(priceNeuf * 0.08));
            years.push({
                year: i + 1,
                rate: Math.round(adjRate * 100),
                value,
                loss,
                totalLoss,
                pctRetained: Math.round((value / priceNeuf) * 100),
            });
        }

        // Sweet spot: best value/year ratio (cost per year of ownership)
        const costPerYear = years.map((y, i) => ({
            year: y.year,
            costPerYear: Math.round(y.totalLoss / (i + 1)),
        }));
        const sweetSpot = costPerYear.reduce((best, y) =>
            y.costPerYear < best.costPerYear ? y : best, costPerYear[0]);

        return { years, sweetSpot, costPerYear };
    }, [priceNeuf, kmPerYear, segment, motorisation, marque]);

    const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

    return (
        <>
            <Helmet>
                <title>Calculateur Décote Voiture — Perte de Valeur par An — Doitz</title>
                <meta name="description" content="Calculez la décote de votre voiture année par année. Trouvez le meilleur moment pour acheter et revendre. Simulateur de perte de valeur automobile." />
            </Helmet>

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <TrendingDown size={14} /> CALCULATEUR
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Calculateur <span className="text-gradient">Décote Voiture</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Visualisez la perte de valeur de votre véhicule année par année. Trouvez le <strong className="text-white">sweet spot</strong> entre coût et usage.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* ── Inputs ── */}
                        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-5 h-fit">
                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Prix neuf : <span className="text-white text-lg">{fmt(priceNeuf)}</span>
                                </label>
                                <input type="range" min={10000} max={120000} step={1000} value={priceNeuf}
                                    onChange={(e) => setPriceNeuf(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Kilométrage / an : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')} km</span>
                                </label>
                                <input type="range" min={5000} max={40000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                                {kmPerYear > 25000 && (
                                    <p className="text-[10px] text-amber-300 mt-1">⚠️ Gros rouleur : la décote est accélérée de ~{Math.round((kmPerYear <= 30000 ? 18 : 30))}%</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Segment</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['citadine', 'compacte', 'suv', 'berline', 'premium', 'utilitaire'] as const).map(s => (
                                        <button key={s} onClick={() => setSegment(s)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${segment === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Motorisation</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['essence', 'diesel', 'hybride', 'electrique'] as const).map(m => (
                                        <button key={m} onClick={() => setMotorisation(m)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${motorisation === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            {m.charAt(0).toUpperCase() + m.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Origine marque</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['francaise', 'allemande', 'japonaise', 'coreenne', 'americaine'] as const).map(b => (
                                        <button key={b} onClick={() => setMarque(b)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${marque === b ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            {b.charAt(0).toUpperCase() + b.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Results ── */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Sweet spot highlight */}
                            <motion.div key={results.sweetSpot.year} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                                className="glass-panel rounded-2xl p-5 border-l-4 border-green-500">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Calculator size={18} className="text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-green-400 font-display">🎯 Sweet Spot : acheter à {results.sweetSpot.year} ans</h3>
                                        <p className="text-sm text-slate-300 mt-1">
                                            Coût moyen de décote le plus bas : <strong className="text-white">{fmt(results.sweetSpot.costPerYear)}/an</strong>.
                                            À cet âge, le véhicule vaut environ <strong className="text-white">{fmt(results.years[results.sweetSpot.year - 1].value)}</strong> ({results.years[results.sweetSpot.year - 1].pctRetained}% du prix neuf).
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Depreciation bar chart */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-white font-display mb-4">Décote année par année</h3>
                                <div className="space-y-2">
                                    {results.years.map((y) => (
                                        <div key={y.year} className="flex items-center gap-3">
                                            <span className="text-xs text-slate-400 w-14 shrink-0 tabular-nums">An {y.year}</span>
                                            <div className="flex-1 relative h-7 bg-slate-800/50 rounded-lg overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }} animate={{ width: `${y.pctRetained}%` }}
                                                    transition={{ delay: y.year * 0.05, duration: 0.4 }}
                                                    className={`absolute inset-y-0 left-0 rounded-lg ${y.year === results.sweetSpot.year
                                                        ? 'bg-gradient-to-r from-green-600 to-green-400'
                                                        : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                                                        }`}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-between px-3">
                                                    <span className="text-[11px] font-bold text-white tabular-nums z-10">{fmt(y.value)}</span>
                                                    <span className="text-[10px] text-slate-300 z-10">{y.pctRetained}%</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-red-400/70 w-20 text-right tabular-nums shrink-0">-{fmt(y.loss)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary table */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-white font-display mb-3">Résumé</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left text-slate-400 py-1.5 text-xs">Année</th>
                                                <th className="text-right text-slate-400 py-1.5 text-xs">Valeur</th>
                                                <th className="text-right text-slate-400 py-1.5 text-xs">Perte An</th>
                                                <th className="text-right text-slate-400 py-1.5 text-xs">Perte Tot.</th>
                                                <th className="text-right text-slate-400 py-1.5 text-xs">Coût/an</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.years.map((y) => (
                                                <tr key={y.year} className={`border-b border-white/5 ${y.year === results.sweetSpot.year ? 'bg-green-500/5' : ''}`}>
                                                    <td className={`py-1.5 tabular-nums ${y.year === results.sweetSpot.year ? 'text-green-400 font-bold' : 'text-white'}`}>
                                                        {y.year === results.sweetSpot.year ? '🎯 ' : ''}An {y.year}
                                                    </td>
                                                    <td className="text-right text-white tabular-nums">{fmt(y.value)}</td>
                                                    <td className="text-right text-red-400 tabular-nums">-{fmt(y.loss)}</td>
                                                    <td className="text-right text-slate-400 tabular-nums">-{fmt(y.totalLoss)}</td>
                                                    <td className={`text-right tabular-nums font-medium ${y.year === results.sweetSpot.year ? 'text-green-400' : 'text-white'}`}>
                                                        {fmt(results.costPerYear[y.year - 1].costPerYear)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Consumer insight */}
                            <div className="glass-panel rounded-2xl p-5 border-l-4 border-blue-500">
                                <h3 className="text-sm font-bold text-white font-display mb-2 flex items-center gap-2">
                                    <Info size={16} className="text-blue-400" />
                                    Conseil consommateur
                                </h3>
                                <p className="text-sm text-slate-300">
                                    {motorisation === 'diesel'
                                        ? "⚠️ Les diesels décotent 10-15% plus vite à cause des ZFE (Zones à Faibles Émissions). Les Crit'Air 3+ sont déjà interdits dans 12 métropoles. Achetez en occasion pour profiter de cette décote, mais évitez si vous êtes en ville."
                                        : motorisation === 'electrique'
                                            ? "⚠️ Les électriques décotent fortement les 3 premières années (technologie qui évolue vite, nouvelles générations tous les 2 ans). Achetez à 2-3 ans pour maximiser la valeur. Exception : les Tesla décotent moins grâce aux mises à jour OTA."
                                            : marque === 'japonaise'
                                                ? "✅ Les marques japonaises (Toyota, Honda) décotent peu grâce à leur fiabilité légendaire — un RAV4 perd 30% en 3 ans vs 45% pour un 3008."
                                                : "💡 Acheter un véhicule de 2-3 ans vous fait économiser la phase de décote la plus forte tout en gardant un véhicule récent."}
                                </p>
                                {kmPerYear > 20000 && (
                                    <p className="text-sm text-amber-300 mt-2">
                                        ⚠️ À {kmPerYear.toLocaleString('fr-FR')} km/an, le kilométrage accélère la décote de ~{Math.round((kmPerYear <= 30000 ? 18 : 30))}%. Pensez à revendre avant les paliers psychologiques (100k, 150k, 200k km).
                                    </p>
                                )}
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-3">
                                <Link to="/outils/simulateur-cout-utilisation" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Simulateur coût total
                                </Link>
                                <Link to="/outils/simulateur-financement" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Simulateur financement
                                </Link>
                                <Link to="/blog/decote-voiture-calculer" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Article décote voiture
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalculateurDecote;
