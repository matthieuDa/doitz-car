import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Fuel, Zap, Leaf, Calculator } from 'lucide-react';

const SimulateurCarburant = () => {
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [years, setYears] = useState(5);
    const [prixEssence, setPrixEssence] = useState(1.85);
    const [prixDiesel, setPrixDiesel] = useState(1.70);
    const [prixElec, setPrixElec] = useState(0.25);

    const vehicles = useMemo(() => {
        const totalKm = kmPerYear * years;

        const data = [
            {
                name: 'Essence',
                icon: <Fuel className="text-orange-400" size={18} />,
                conso: 6.5, // L/100km
                prixUnit: prixEssence,
                unit: 'L',
                co2PerKm: 150,
                color: 'orange',
                entretien: 1200 * years,
            },
            {
                name: 'Diesel',
                icon: <Fuel className="text-slate-400" size={18} />,
                conso: 5.2,
                prixUnit: prixDiesel,
                unit: 'L',
                co2PerKm: 130,
                color: 'slate',
                entretien: 1400 * years,
            },
            {
                name: 'Hybride (HEV)',
                icon: <Leaf className="text-green-400" size={18} />,
                conso: 4.5,
                prixUnit: prixEssence,
                unit: 'L',
                co2PerKm: 100,
                color: 'green',
                entretien: 1000 * years,
            },
            {
                name: 'Hybride rech. (PHEV)',
                icon: <Leaf className="text-emerald-400" size={18} />,
                // PHEV réaliste: 60% trajet court (électrique ~15kWh/100km) + 40% longs trajets (essence ~5.5L/100km)
                conso: 5.5, // L-eq/100km en usage mixte réaliste (WLTP sous-estime beaucoup)
                prixUnit: 0.60 * prixElec * (15 / 5.5) + 0.40 * prixEssence, // prix moyen pondéré
                unit: 'L eq.',
                co2PerKm: 40,
                color: 'emerald',
                entretien: 1100 * years,
            },
            {
                name: 'Électrique (BEV)',
                icon: <Zap className="text-cyan-400" size={18} />,
                conso: 17, // kWh/100km
                prixUnit: prixElec, // tarif domicile
                unit: 'kWh',
                co2PerKm: 0,
                color: 'cyan',
                entretien: 600 * years,
            },
        ];

        return data.map((v) => {
            const consoTotal = (v.conso / 100) * totalKm;
            const costCarburant = Math.round(consoTotal * v.prixUnit);
            const costPerKm = Math.round((consoTotal * v.prixUnit / totalKm) * 1000) / 10; // centimes
            const costPerMonth = Math.round(costCarburant / (years * 12));
            const co2Total = Math.round((v.co2PerKm * totalKm) / 1000); // kg → tonnes
            return {
                ...v,
                consoTotal: Math.round(consoTotal),
                costCarburant,
                costPerKm,
                costPerMonth,
                co2Total,
                totalCost: costCarburant + v.entretien,
            };
        });
    }, [kmPerYear, years, prixEssence, prixDiesel, prixElec]);

    const cheapest = vehicles.reduce((best, v) => v.totalCost < best.totalCost ? v : best, vehicles[0]);
    const formatEuro = (n: number) => n.toLocaleString('fr-FR') + ' €';

    return (
        <>
            <Helmet>
                <title>Simulateur Carburant — Diesel vs Essence vs Électrique — Doitz</title>
                <meta name="description" content="Comparez diesel, essence, hybride et électrique : coût au km, coût annuel, impact CO2. Simulateur interactif gratuit." />
            </Helmet>

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Fuel size={14} />
                            OUTIL INTERACTIF
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Simulateur <span className="text-gradient">Coût Carburant</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Essence, diesel, hybride, électrique : quel est le carburant le plus économique pour votre usage ?
                        </p>
                    </div>

                    {/* Sliders */}
                    <div className="glass-panel rounded-3xl p-6 mb-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Kilométrage/an : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')} km</span>
                                </label>
                                <input type="range" min={5000} max={50000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Durée : <span className="text-white text-lg">{years} ans</span>
                                </label>
                                <input type="range" min={1} max={10} value={years}
                                    onChange={(e) => setYears(Number(e.target.value))} className="range-slider" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 block">Essence €/L</label>
                                        <input type="number" step={0.05} value={prixEssence}
                                            onChange={(e) => setPrixEssence(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 block">Diesel €/L</label>
                                        <input type="number" step={0.05} value={prixDiesel}
                                            onChange={(e) => setPrixDiesel(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 block">Élec €/kWh</label>
                                        <input type="number" step={0.01} value={prixElec}
                                            onChange={(e) => setPrixElec(Number(e.target.value))}
                                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        {vehicles.map((v) => (
                            <motion.div
                                key={v.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl p-4 border transition-all ${v.name === cheapest.name
                                    ? 'bg-green-500/5 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                    : 'bg-white/[0.02] border-white/10'
                                    }`}
                            >
                                {v.name === cheapest.name && (
                                    <div className="text-[10px] font-bold text-green-400 mb-2">🏆 LE PLUS ÉCONOMIQUE</div>
                                )}
                                <div className="flex items-center gap-2 mb-3">
                                    {v.icon}
                                    <span className="text-sm font-bold text-white font-display">{v.name}</span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Carburant/{years}a</span>
                                        <span className="text-white font-bold tabular-nums">{formatEuro(v.costCarburant)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Entretien/{years}a</span>
                                        <span className="text-white font-bold tabular-nums">{formatEuro(v.entretien)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Coût/km</span>
                                        <span className="text-white font-bold tabular-nums">{v.costPerKm} ct</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Coût/mois</span>
                                        <span className="text-white font-bold tabular-nums">{formatEuro(v.costPerMonth)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">CO₂ total</span>
                                        <span className={`font-bold tabular-nums ${v.co2Total === 0 ? 'text-green-400' : 'text-white'}`}>
                                            {v.co2Total > 0 ? `${v.co2Total} t` : '0 🌱'}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-white/5 flex justify-between">
                                        <span className="text-slate-300 font-medium">TOTAL</span>
                                        <span className={`font-bold tabular-nums ${v.name === cheapest.name ? 'text-green-400' : 'text-white'}`}>
                                            {formatEuro(v.totalCost)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Synthesis — dynamic based on user inputs */}
                    <div className="glass-panel rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-bold text-white font-display mb-3">💡 Analyse consommateur</h2>
                        <div className="space-y-2 text-sm text-slate-300">
                            <p>Sur <strong className="text-white">{(kmPerYear * years).toLocaleString('fr-FR')} km</strong> ({years} ans) :</p>
                            <p>• L'<strong className="text-green-400">électrique</strong> économise <strong className="text-green-400">{formatEuro(vehicles[0].costCarburant - vehicles[4].costCarburant)}</strong> vs essence en carburant seul</p>
                            {kmPerYear >= 20000
                                ? <p>• À <strong className="text-white">{kmPerYear.toLocaleString('fr-FR')} km/an</strong>, le diesel redevient compétitif face à l'essence (-{formatEuro(vehicles[0].costCarburant - vehicles[1].costCarburant)})</p>
                                : <p>• À <strong className="text-white">{kmPerYear.toLocaleString('fr-FR')} km/an</strong>, le diesel n'est <strong className="text-red-400">pas rentable</strong> — l'essence ou l'hybride sont plus avantageux</p>
                            }
                            <p>• L'hybride classique (HEV) est le <strong className="text-green-400">meilleur compromis</strong> sans borne de recharge</p>
                            <p>• Le PHEV n'est rentable que si vous rechargez <strong>quotidiennement à domicile</strong>. Sans recharge régulière, il consomme autant qu'une essence avec 200 kg de plus</p>
                        </div>
                        <div className="mt-3 p-3 bg-amber-500/10 rounded-lg">
                            <p className="text-xs text-amber-300">⚠️ <strong>Ce que ce simulateur ne montre pas :</strong> le surcoût d'achat. Un EV coûte 8 000-15 000€ de plus qu'un thermique équivalent. L'économie carburant ne compense pas toujours, surtout pour les petits rouleurs ({'<'} 10 000 km/an).</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-500/10 rounded-lg">
                            <p className="text-xs text-blue-300">💡 <strong>Recharge publique vs domicile :</strong> ce calcul utilise le prix domicile ({prixElec}€/kWh). En charge publique : 0.40 à 0.70€/kWh, soit 2× à 3× plus cher. Si vous n'avez pas de prise à domicile, le coût EV est bien plus élevé.</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="text-center glass-panel rounded-2xl p-6">
                        <p className="text-slate-400 text-sm mb-4">Articles connexes :</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link to="/blog/electrique-vs-thermique" className="text-xs text-blue-400 hover:text-blue-300 underline">Électrique vs Thermique</Link>
                            <Link to="/blog/hybride-rechargeable-vs-classique" className="text-xs text-blue-400 hover:text-blue-300 underline">Hybride rech. vs classique</Link>
                            <Link to="/blog/cout-recharge-electrique-calcul" className="text-xs text-blue-400 hover:text-blue-300 underline">Coût de recharge EV</Link>
                            <Link to="/blog/borne-recharge-domicile-guide" className="text-xs text-blue-400 hover:text-blue-300 underline">Borne de recharge domicile</Link>
                            <Link to="/blog/comparatif-suv-hybrides" className="text-xs text-blue-400 hover:text-blue-300 underline">Comparatif SUV hybrides</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SimulateurCarburant;
