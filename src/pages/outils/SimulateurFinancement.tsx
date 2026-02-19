import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const FAQ_FINANCEMENT = [
    { question: 'LOA ou LLD : quelle est la différence ?', answer: 'La LOA (Location avec Option d\'Achat) vous permet de racheter le véhicule en fin de contrat. La LLD (Location Longue Durée) est une pure location : vous ne devenez jamais propriétaire. La LOA est plus flexible mais coûte souvent plus cher au total que l\'achat direct.' },
    { question: 'Quel est le mode de financement le moins cher ?', answer: 'L\'achat d\'occasion récente (2-3 ans) financé par crédit est généralement le plus économique. Vous évitez la forte décote des premières années tout en restant propriétaire. L\'achat comptant est idéal si vous avez la trésorerie.' },
    { question: 'Le leasing est-il toujours désavantageux ?', answer: 'Non. Le leasing (LLD/LOA) est pertinent si vous changez de véhicule tous les 2-3 ans et que la simplicité (entretien inclus, pas de revente) a de la valeur pour vous. Mais en coût pur, l\'achat reste le plus économique sur 4+ ans.' },
    { question: 'Comment est calculé le \"coût réel / mois\" ?', answer: 'Le coût réel mensuel = (total des versements – valeur résiduelle à la revente) ÷ nombre de mois. C\'est la seule façon honnête de comparer les modes de financement : la mensualité seule ne reflète pas le vrai coût car elle ignore la valeur résiduelle.' },
    { question: 'Quelle est la durée de crédit auto recommandée ?', answer: 'Idéalement 36 à 60 mois. Au-delà de 60 mois, les intérêts accumulés deviennent significatifs et le véhicule se déprécie plus vite que le remboursement. Un apport de 10-20% réduit le coût total et facilite l\'obtention du crédit.' },
];

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

/* ─── Mode definitions ─── */
type ModeKey = 'loa' | 'lld' | 'credit' | 'cash' | 'occasion';

const MODE_CONFIG: { key: ModeKey; label: string; shortLabel: string; color: string; bg: string; locked?: boolean }[] = [
    { key: 'occasion', label: 'Occasion récente à crédit', shortLabel: '🏆 Occasion', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/30', locked: true },
    { key: 'loa', label: 'LOA (Location avec Option d\'Achat)', shortLabel: 'LOA', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
    { key: 'lld', label: 'LLD (Location Longue Durée)', shortLabel: 'LLD', color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/20' },
    { key: 'credit', label: 'Crédit auto (neuf)', shortLabel: 'Crédit neuf', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
    { key: 'cash', label: 'Achat comptant (neuf)', shortLabel: 'Comptant', color: 'text-green-300', bg: 'bg-green-500/5 border-green-500/20' },
];

const SimulateurFinancement = () => {
    const [price, setPrice] = useState(30000);
    const [duration, setDuration] = useState(48);
    const [downPayment, setDownPayment] = useState(3000);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [creditRate, setCreditRate] = useState(4.5);
    const [selectedModes, setSelectedModes] = useState<Set<ModeKey>>(new Set(['occasion', 'loa', 'credit']));
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const toggleMode = (key: ModeKey) => {
        if (key === 'occasion') return; // locked
        setSelectedModes(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size <= 2) return prev; // minimum 2 modes
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

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
        const loaNetCostReturn = loaTotalPaid;
        const loaNetCostBuy = loaTotalPaid + loaResidualValue;
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

    // Best option only among selected modes
    const bestOption = Array.from(selectedModes).reduce((best, key) => {
        const r = results[key] as any;
        return r.realMonthly < best.cost ? { name: key, cost: r.realMonthly } : best;
    }, { name: '' as string, cost: Infinity });

    const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

    const activeModes = MODE_CONFIG.filter(m => selectedModes.has(m.key));

    return (
        <>
            <SEO
                title="Simulateur LLD vs LOA vs Crédit — Comparateur Financement Auto"
                description="Comparez LLD, LOA, crédit auto et achat comptant. Simulateur interactif pour trouver le financement le moins cher en coût réel mensuel."
                canonical={`${SITE_URL}/outils/simulateur-financement`}
                keywords={['LOA', 'LLD', 'crédit auto', 'financement voiture', 'leasing vs achat', 'simulateur financement']}
                schema={[
                    generateWebApplicationSchema('Simulateur Financement Auto — LLD vs LOA vs Crédit', 'Comparez les modes de financement auto : LOA, LLD, crédit, achat comptant et occasion.', `${SITE_URL}/outils/simulateur-financement`, ['financement', 'LOA', 'LLD', 'crédit auto']),
                    generateFAQSchema(FAQ_FINANCEMENT),
                ]}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                    { name: 'Simulateur Financement', url: `${SITE_URL}/outils/simulateur-financement` },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Calculator size={14} /> OUTIL INTERACTIF
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Simulateur <span className="text-gradient">Financement Auto</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Comparez les modes de financement qui vous intéressent. Le <strong className="text-white">coût réel mensuel</strong> tient compte de la revente ou restitution — c'est LE chiffre qui compte.
                        </p>
                    </div>

                    {/* ── Mode selection ── */}
                    <div className="glass-panel rounded-3xl p-4 md:p-6 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={14} className="text-blue-400 shrink-0" />
                            <p className="text-xs text-slate-400">Cochez les financements à comparer. L'option « Occasion récente » est toujours incluse comme référence.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {MODE_CONFIG.map(m => {
                                const isSelected = selectedModes.has(m.key);
                                const isLocked = m.locked;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => toggleMode(m.key)}
                                        disabled={isLocked}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${isSelected
                                            ? isLocked
                                                ? 'bg-green-500/15 border-green-500/40 text-green-400 cursor-default'
                                                : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                                            : 'bg-white/[0.02] border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                            }`}
                                    >
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[10px] ${isSelected
                                            ? isLocked
                                                ? 'border-green-500 bg-green-500 text-white'
                                                : 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-slate-600'
                                            }`}>
                                            {isSelected && '✓'}
                                        </span>
                                        {m.label}
                                        {isLocked && <span className="text-[10px] text-green-500/70 ml-1">recommandé</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Sliders ── */}
                    <div className="glass-panel rounded-3xl p-6 md:p-8 mb-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SliderInput label="Prix du véhicule neuf" value={price} onChange={setPrice} min={10000} max={100000} step={1000} unit="€" />
                            <SliderInput label="Durée" value={duration} onChange={setDuration} min={12} max={72} step={6} unit=" mois" />
                            <SliderInput label="Apport / 1er loyer" value={downPayment} onChange={setDownPayment} min={0} max={Math.round(price * 0.3)} step={500} unit="€" />
                            <SliderInput label="Kilométrage / an" value={kmPerYear} onChange={setKmPerYear} min={5000} max={40000} step={1000} suffix="km/an" />
                            <SliderInput label="Taux crédit" value={creditRate} onChange={setCreditRate} min={0} max={10} step={0.1} unit="%" />
                        </div>
                    </div>

                    {/* ── Big metric: coût réel mensuel (only selected modes) ── */}
                    <div className={`grid gap-3 mb-8`} style={{ gridTemplateColumns: `repeat(${activeModes.length}, minmax(0, 1fr))` }}>
                        {activeModes.map(({ key, shortLabel, color, bg }) => {
                            const r = results[key] as any;
                            const isBest = bestOption.name === key;
                            return (
                                <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`rounded-xl border p-4 text-center relative ${isBest ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : bg}`}>
                                    {isBest && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full whitespace-nowrap">Le moins cher</div>}
                                    <div className={`text-[10px] uppercase tracking-widest font-bold ${color} mb-1`}>{shortLabel}</div>
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

                    {/* ── Explanation tooltip ── */}
                    <div className="glass-panel rounded-xl p-4 mb-8 flex items-start gap-3">
                        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-400">
                            <strong className="text-white">Comment lire le « Coût réel / mois » ?</strong><br />
                            C'est le vrai coût d'usage de votre véhicule : <span className="text-blue-400">(total versé − valeur de revente) ÷ nombre de mois</span>.<br />
                            Il élimine l'illusion des « petites mensualités » de LOA/LLD qui masquent un coût total bien plus élevé.
                        </div>
                    </div>

                    {/* ── Detail cards (only selected modes) ── */}
                    <div className={`grid md:grid-cols-2 lg:grid-cols-${Math.min(activeModes.length, 3)} gap-5 mb-8`}>
                        {selectedModes.has('occasion') && (
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
                        )}

                        {selectedModes.has('loa') && (
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
                        )}

                        {selectedModes.has('lld') && (
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
                        )}

                        {selectedModes.has('credit') && (
                            <ResultCard title="Crédit auto (neuf)" icon={<CheckCircle className="text-blue-400" size={20} />} isBest={bestOption.name === 'credit'}>
                                <Stat label="Mensualité" value={fmt(results.credit.monthly)} />
                                <Stat label="Total remboursé" value={fmt(results.credit.totalPaid)} />
                                <Stat label="Dont intérêts" value={fmt(results.credit.interest)} />
                                <Stat label="Valeur résiduelle" value={fmt(results.credit.residual)} highlight />
                                <Stat label="⭐ Coût réel / mois" value={fmt(results.credit.realMonthly)} highlight={bestOption.name === 'credit'} big />
                                <Stat label="Propriétaire ?" value="✅ Oui" />
                            </ResultCard>
                        )}

                        {selectedModes.has('cash') && (
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
                        )}
                    </div>

                    {/* ── Comparative table (only selected modes) ── */}
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
                                    {activeModes.map(({ key, shortLabel, color }) => {
                                        const d = results[key] as any;
                                        const monthly = key === 'cash' ? null : d.monthly;
                                        const isBest = d.realMonthly === bestOption.cost;
                                        return (
                                            <tr key={key} className="border-b border-white/5">
                                                <td className={`py-2 font-medium ${color}`}>{shortLabel}</td>
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

                    {/* FAQ Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white font-display mb-6">Questions fréquentes</h2>
                        <div className="space-y-3">
                            {FAQ_FINANCEMENT.map((faq, i) => (
                                <div key={i} className="glass-panel rounded-2xl overflow-hidden">
                                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left">
                                        <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
                                        {faqOpen === i ? <ChevronUp size={18} className="text-blue-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
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

export default SimulateurFinancement;
