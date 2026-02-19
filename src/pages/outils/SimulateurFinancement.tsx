import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';

/* ─── Reusable slider with native drag (no overlay div) ─── */
const SliderInput = ({ label, value, onChange, min, max, step, unit, suffix }: {
    label: string; value: number; onChange: (v: number) => void;
    min: number; max: number; step: number; unit?: string; suffix?: string;
}) => {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display">{label}</label>
                <span className="text-xl font-bold text-white font-display tabular-nums">
                    {value.toLocaleString('fr-FR')}
                    {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
                    {suffix && <span className="text-sm text-slate-400 ml-1">{suffix}</span>}
                </span>
            </div>
            <div className="relative">
                {/* Gradient fill bar (behind the native input) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 pointer-events-none z-[1]"
                    style={{ width: `${pct}%` }} />
                {/* Native input — full drag support */}
                <input
                    type="range"
                    min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="range-slider w-full"
                />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{min.toLocaleString('fr-FR')}{unit || ''}</span>
                <span>{max.toLocaleString('fr-FR')}{unit || ''}</span>
            </div>
        </div>
    );
};

/* ─── Stat row ─── */
const Stat = ({ label, value, highlight, danger, big }: {
    label: string; value: string; highlight?: boolean; danger?: boolean; big?: boolean;
}) => (
    <div className={`flex justify-between items-center border-b border-white/5 last:border-0 ${big ? 'py-2.5' : 'py-1.5'}`}>
        <span className={`text-slate-400 ${big ? 'text-sm font-medium' : 'text-sm'}`}>{label}</span>
        <span className={`font-bold font-display tabular-nums ${big ? 'text-lg' : 'text-sm'
            } ${danger ? 'text-red-400' : highlight ? 'text-green-400' : 'text-white'}`}>{value}</span>
    </div>
);

/* ─── Result card ─── */
const ResultCard = ({ title, icon, isBest, isWarning, children }: {
    title: string; icon: React.ReactNode; isBest?: boolean; isWarning?: boolean; children: React.ReactNode;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl p-5 border transition-all ${isBest
                ? 'bg-green-500/5 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                : isWarning
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-white/[0.02] border-white/10'
            }`}
    >
        {isBest && (
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                ✅ Le plus avantageux
            </div>
        )}
        {isWarning && (
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⚠️ Attention
            </div>
        )}
        <div className="flex items-center gap-2 mb-4 mt-1">
            {icon}
            <h3 className="text-lg font-bold text-white font-display">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const SimulateurFinancement = () => {
    const [price, setPrice] = useState(30000);
    const [duration, setDuration] = useState(48);
    const [downPayment, setDownPayment] = useState(3000);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [creditRate, setCreditRate] = useState(4.5);

    const results = useMemo(() => {
        const months = duration;
        // Depreciation curve
        const depRates = [0.25, 0.15, 0.10, 0.08, 0.06];
        const years = Math.ceil(months / 12);
        let totalDep = 0;
        for (let i = 0; i < years && i < depRates.length; i++) totalDep += depRates[i];
        const residualValue = Math.max(Math.round(price * (1 - totalDep)), Math.round(price * 0.3));

        // ── LOA ──
        const loaResidualPct = 0.38;
        const loaResidualValue = Math.round(price * loaResidualPct);
        const loaFinCost = price * 0.08;
        const loaMonthly = Math.round((price - loaResidualValue + loaFinCost - downPayment) / months);
        const loaTotalPaid = downPayment + loaMonthly * months;
        const loaNetCostReturn = loaTotalPaid; // restitution: all paid, nothing left
        const loaNetCostBuy = loaTotalPaid + loaResidualValue; // if buying
        // Coût réel mensuel = total net / months (what it REALLY cost per month after all is done)
        const loaRealMonthly = Math.round(loaNetCostReturn / months);

        // ── LLD ──
        const lldPremium = 30;
        const lldMonthly = loaMonthly + lldPremium;
        const lldTotalPaid = downPayment + lldMonthly * months;
        const lldNetCost = lldTotalPaid;
        const lldRealMonthly = Math.round(lldNetCost / months);

        // ── Crédit neuf ──
        const creditAmount = price - downPayment;
        const mr = creditRate / 100 / 12;
        const creditMonthly = mr > 0
            ? Math.round(creditAmount * mr / (1 - Math.pow(1 + mr, -months)))
            : Math.round(creditAmount / months);
        const creditTotalPaid = downPayment + creditMonthly * months;
        const creditInterest = creditTotalPaid - price;
        const creditNetCost = creditTotalPaid - residualValue;
        const creditRealMonthly = Math.round(creditNetCost / months);

        // ── Comptant ──
        const cashNetCost = price - residualValue;
        const cashRealMonthly = Math.round(cashNetCost / months);

        // ── Occasion 3 ans + crédit ──
        const occasionPrice = Math.round(price * 0.55);
        const occasionDown = Math.min(downPayment, Math.round(occasionPrice * 0.15));
        const occasionFinanced = occasionPrice - occasionDown;
        const or = (creditRate + 0.5) / 100 / 12;
        const occasionMonthly = or > 0
            ? Math.round(occasionFinanced * or / (1 - Math.pow(1 + or, -months)))
            : Math.round(occasionFinanced / months);
        const occasionTotalPaid = occasionDown + occasionMonthly * months;
        const occasionResidual = Math.round(price * 0.30);
        const occasionNetCost = occasionTotalPaid - occasionResidual;
        const occasionRealMonthly = Math.round(occasionNetCost / months);

        return {
            loa: { monthly: loaMonthly, totalPaid: loaTotalPaid, netCost: loaNetCostReturn, buyNetCost: loaNetCostBuy, residual: loaResidualValue, realMonthly: loaRealMonthly, ownsVehicle: false },
            lld: { monthly: lldMonthly, totalPaid: lldTotalPaid, netCost: lldNetCost, realMonthly: lldRealMonthly, ownsVehicle: false },
            credit: { monthly: creditMonthly, totalPaid: creditTotalPaid, interest: Math.round(creditInterest), netCost: creditNetCost, residual: residualValue, realMonthly: creditRealMonthly, ownsVehicle: true },
            cash: { netCost: cashNetCost, residual: residualValue, realMonthly: cashRealMonthly, ownsVehicle: true },
            occasion: { price: occasionPrice, monthly: occasionMonthly, totalPaid: occasionTotalPaid, netCost: occasionNetCost, residual: occasionResidual, realMonthly: occasionRealMonthly, ownsVehicle: true },
        };
    }, [price, duration, downPayment, kmPerYear, creditRate]);

    const bestOption = Object.entries(results).reduce((best, [key, val]) =>
        (val as any).realMonthly < best.cost ? { name: key, cost: (val as any).realMonthly } : best
        , { name: '', cost: Infinity });

    const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

    return (
        <>
            <Helmet>
                <title>Simulateur LLD vs LOA vs Crédit — Doitz</title>
                <meta name="description" content="Comparez LLD, LOA, crédit auto et achat comptant. Simulateur interactif pour trouver le financement le moins cher." />
            </Helmet>

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} /> Retour au blog
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Calculator size={14} /> OUTIL INTERACTIF
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Simulateur <span className="text-gradient">LLD vs LOA vs Crédit</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Comparez les 5 modes de financement. Le <strong className="text-white">coût réel mensuel</strong> tient compte de la revente ou restitution — c'est LE chiffre qui compte.
                        </p>
                    </div>

                    {/* ── Sliders ── */}
                    <div className="glass-panel rounded-3xl p-6 md:p-8 mb-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SliderInput label="Prix du véhicule" value={price} onChange={setPrice} min={10000} max={100000} step={1000} unit="€" />
                            <SliderInput label="Durée" value={duration} onChange={setDuration} min={12} max={72} step={6} unit=" mois" />
                            <SliderInput label="Apport / 1er loyer" value={downPayment} onChange={setDownPayment} min={0} max={Math.round(price * 0.3)} step={500} unit="€" />
                            <SliderInput label="Kilométrage / an" value={kmPerYear} onChange={setKmPerYear} min={5000} max={40000} step={1000} suffix="km/an" />
                            <SliderInput label="Taux crédit" value={creditRate} onChange={setCreditRate} min={0} max={10} step={0.1} unit="%" />
                        </div>
                    </div>

                    {/* ── Big metric: coût réel mensuel ── */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                        {([
                            { key: 'loa', label: 'LOA', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
                            { key: 'lld', label: 'LLD', color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
                            { key: 'credit', label: 'Crédit neuf', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
                            { key: 'cash', label: 'Comptant', color: 'text-green-300', bg: 'bg-green-500/5 border-green-500/20' },
                            { key: 'occasion', label: '🏆 Occasion', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/30' },
                        ] as const).map(({ key, label, color, bg }) => {
                            const r = results[key] as any;
                            const isBest = bestOption.name === key;
                            return (
                                <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`rounded-xl border p-4 text-center relative ${isBest ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : bg}`}>
                                    {isBest && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full whitespace-nowrap">Le moins cher</div>}
                                    <div className={`text-[10px] uppercase tracking-widest font-bold ${color} mb-1`}>{label}</div>
                                    <div className="text-xs text-slate-500 mb-1">Coût réel / mois</div>
                                    <motion.div key={r.realMonthly} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                        className={`text-2xl md:text-3xl font-bold font-display tabular-nums ${isBest ? 'text-green-400' : 'text-white'}`}>
                                        {fmt(r.realMonthly)}
                                    </motion.div>
                                    <div className="text-[10px] text-slate-500 mt-1">total net: {fmt(r.netCost)}</div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* ── Detail cards ── */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        <ResultCard title="LOA (Location avec Option)" icon={<AlertTriangle className="text-amber-400" size={20} />} isWarning>
                            <Stat label="Mensualité contrat" value={fmt(results.loa.monthly)} />
                            <Stat label="Total versé" value={fmt(results.loa.totalPaid)} />
                            <Stat label="Rachat (option)" value={fmt(results.loa.residual)} />
                            <Stat label="Coût si restitution" value={fmt(results.loa.netCost)} danger />
                            <Stat label="Coût si rachat" value={fmt(results.loa.buyNetCost)} danger />
                            <Stat label="⭐ Coût réel / mois" value={fmt(results.loa.realMonthly)} danger big />
                            <div className="mt-3 p-2 bg-amber-500/10 rounded-lg">
                                <p className="text-xs text-amber-300">⚠️ 75% des souscripteurs rendent le véhicule : prix de rachat trop haut</p>
                            </div>
                        </ResultCard>

                        <ResultCard title="LLD (Location Longue Durée)" icon={<TrendingDown className="text-red-400" size={20} />} isWarning>
                            <Stat label="Mensualité (entretien incl.)" value={fmt(results.lld.monthly)} />
                            <Stat label="Total versé" value={fmt(results.lld.totalPaid)} />
                            <Stat label="Coût réel net" value={fmt(results.lld.netCost)} danger />
                            <Stat label="⭐ Coût réel / mois" value={fmt(results.lld.realMonthly)} danger big />
                            <Stat label="Propriétaire ?" value="❌ Jamais" />
                            <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
                                <p className="text-xs text-red-300">Chaque euro versé est perdu. + frais restitution (500-3 000€).</p>
                            </div>
                        </ResultCard>

                        <ResultCard title="Crédit auto (neuf)" icon={<CheckCircle className="text-blue-400" size={20} />} isBest={bestOption.name === 'credit'}>
                            <Stat label="Mensualité" value={fmt(results.credit.monthly)} />
                            <Stat label="Total remboursé" value={fmt(results.credit.totalPaid)} />
                            <Stat label="Dont intérêts" value={fmt(results.credit.interest)} />
                            <Stat label="Valeur résiduelle" value={fmt(results.credit.residual)} highlight />
                            <Stat label="⭐ Coût réel / mois" value={fmt(results.credit.realMonthly)} highlight={bestOption.name === 'credit'} big />
                            <Stat label="Propriétaire ?" value="✅ Oui" />
                        </ResultCard>

                        <ResultCard title="Achat comptant (neuf)" icon={<CheckCircle className="text-green-400" size={20} />} isBest={bestOption.name === 'cash'}>
                            <Stat label="Prix d'achat" value={fmt(price)} />
                            <Stat label="Intérêts" value="0 €" highlight />
                            <Stat label="Valeur résiduelle" value={fmt(results.cash.residual)} highlight />
                            <Stat label="⭐ Coût réel / mois" value={fmt(results.cash.realMonthly)} highlight={bestOption.name === 'cash'} big />
                            <Stat label="Propriétaire ?" value="✅ Oui (immédiat)" />
                            <div className="mt-3 p-2 bg-green-500/10 rounded-lg">
                                <p className="text-xs text-green-300">Pouvoir de négociation maximal (-5 à -10%).</p>
                            </div>
                        </ResultCard>

                        <ResultCard title="🏆 Occasion 3 ans + Crédit" icon={<TrendingUp className="text-green-400" size={20} />} isBest={bestOption.name === 'occasion'}>
                            <Stat label="Prix d'achat (−45%)" value={fmt(results.occasion.price)} highlight />
                            <Stat label="Mensualité" value={fmt(results.occasion.monthly)} />
                            <Stat label="Total remboursé" value={fmt(results.occasion.totalPaid)} />
                            <Stat label="Valeur résiduelle" value={fmt(results.occasion.residual)} highlight />
                            <Stat label="⭐ Coût réel / mois" value={fmt(results.occasion.realMonthly)} highlight big />
                            <Stat label="Propriétaire ?" value="✅ Oui" />
                            <div className="mt-3 p-2 bg-green-500/10 rounded-lg">
                                <p className="text-xs text-green-300">🏆 Stratégie Doitz : occasion + import = jusqu'à -60% vs LOA neuve</p>
                            </div>
                        </ResultCard>
                    </div>

                    {/* ── Comparative table ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass-panel rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-bold text-white font-display mb-4">📊 Synthèse comparative</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left text-slate-400 py-2 font-medium">Mode</th>
                                        <th className="text-right text-slate-400 py-2 font-medium">Mensualité</th>
                                        <th className="text-right text-slate-400 py-2 font-medium">Total versé</th>
                                        <th className="text-right text-slate-400 py-2 font-medium whitespace-nowrap">⭐ Coût réel/mois</th>
                                        <th className="text-right text-slate-400 py-2 font-medium">Coût net total</th>
                                        <th className="text-center text-slate-400 py-2 font-medium">Proprio ?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {([
                                        { name: 'LOA', data: results.loa, color: 'text-amber-300', monthly: results.loa.monthly },
                                        { name: 'LLD', data: results.lld, color: 'text-red-300', monthly: results.lld.monthly },
                                        { name: 'Crédit neuf', data: results.credit, color: 'text-blue-300', monthly: results.credit.monthly },
                                        { name: 'Comptant', data: results.cash, color: 'text-green-300', monthly: null },
                                        { name: '🏆 Occasion', data: results.occasion, color: 'text-green-400 font-bold', monthly: results.occasion.monthly },
                                    ] as const).map(({ name, data, color, monthly }) => {
                                        const d = data as any;
                                        const isBest = d.realMonthly === bestOption.cost;
                                        return (
                                            <tr key={name} className="border-b border-white/5">
                                                <td className={`py-2 font-medium ${color}`}>{name}</td>
                                                <td className="text-right text-white tabular-nums">{monthly != null ? fmt(monthly) : '—'}</td>
                                                <td className="text-right text-white tabular-nums">{d.totalPaid ? fmt(d.totalPaid) : fmt(price)}</td>
                                                <td className={`text-right font-bold tabular-nums ${isBest ? 'text-green-400' : d.ownsVehicle ? 'text-blue-400' : 'text-red-400'}`}>
                                                    {fmt(d.realMonthly)}
                                                </td>
                                                <td className={`text-right font-bold tabular-nums ${d.ownsVehicle ? 'text-blue-400' : 'text-red-400'}`}>
                                                    {fmt(d.netCost)}
                                                </td>
                                                <td className="text-center">{d.ownsVehicle ? '✅' : '❌'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">⭐ Le <strong>coût réel / mois</strong> = (total versé − valeur résiduelle à la revente) ÷ nombre de mois. C'est le vrai coût d'usage du véhicule.</p>
                    </motion.div>

                    {/* ── CTA ── */}
                    <div className="text-center glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white font-display mb-2">Trouvez votre véhicule au meilleur prix</h2>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Doitz source des véhicules d'occasion récents sur tout le marché européen. Économisez 20-30% par rapport aux prix français.
                        </p>
                        <Link to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transform hover:-translate-y-0.5">
                            Décrivez votre projet →
                        </Link>
                        <div className="mt-4 flex flex-wrap gap-3 justify-center">
                            <Link to="/blog/lld-vs-loa-vs-credit" className="text-xs text-blue-400 hover:text-blue-300 underline">LLD vs LOA vs Crédit</Link>
                            <Link to="/blog/piege-loa-ce-quon-ne-vous-dit-pas" className="text-xs text-blue-400 hover:text-blue-300 underline">Les pièges de la LOA</Link>
                            <Link to="/blog/leasing-ou-achat-comparatif" className="text-xs text-blue-400 hover:text-blue-300 underline">Leasing ou achat ?</Link>
                            <Link to="/blog/credit-auto-meilleur-taux" className="text-xs text-blue-400 hover:text-blue-300 underline">Meilleur taux crédit</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SimulateurFinancement;
