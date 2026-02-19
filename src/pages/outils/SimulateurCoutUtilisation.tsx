import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Calculator, TrendingDown } from 'lucide-react';

const SimulateurCoutUtilisation = () => {
    const [purchasePrice, setPurchasePrice] = useState(25000);
    const [vehicleAge, setVehicleAge] = useState(3);
    const [kmPerYear, setKmPerYear] = useState(15000);
    const [holdYears, setHoldYears] = useState(4);
    const [fuel, setFuel] = useState<'essence' | 'diesel' | 'hybride' | 'electrique'>('essence');
    const [insurance, setInsurance] = useState(800);
    const [parkingPerMonth, setParkingPerMonth] = useState(0);
    const [peagesPerMonth, setPeagesPerMonth] = useState(0);
    const [creditRate, setCreditRate] = useState(0);

    const results = useMemo(() => {
        // Depreciation based on vehicle age at purchase
        const depByAge: Record<number, number[]> = {
            0: [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03],
            1: [0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03],
            2: [0.10, 0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.02],
            3: [0.08, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.02, 0.02],
            5: [0.06, 0.05, 0.04, 0.03, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02],
            7: [0.04, 0.04, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.01],
            10: [0.03, 0.03, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01],
        };

        const ageKey = Object.keys(depByAge).map(Number).sort((a, b) => a - b)
            .reduce((closest, k) => Math.abs(k - vehicleAge) < Math.abs(closest - vehicleAge) ? k : closest, 0);
        const rates = depByAge[ageKey];

        // Estimate original new price from purchase price and age
        const ageFactors: Record<number, number> = { 0: 1, 1: 0.80, 2: 0.70, 3: 0.55, 5: 0.42, 7: 0.32, 10: 0.22 };
        const ageFactor = ageFactors[ageKey] || 0.35;
        const estimatedNewPrice = Math.round(purchasePrice / ageFactor);

        let currentValue = purchasePrice;
        let totalDepreciation = 0;
        for (let i = 0; i < holdYears && i < rates.length; i++) {
            const loss = estimatedNewPrice * rates[i];
            totalDepreciation += loss;
            currentValue -= loss;
        }
        currentValue = Math.max(currentValue, purchasePrice * 0.2);
        totalDepreciation = purchasePrice - currentValue;

        // Fuel cost
        const consoRates: Record<string, number> = {
            essence: 6.5, diesel: 5.2, hybride: 4.5, electrique: 17
        };
        const fuelPrices: Record<string, number> = {
            essence: 1.85, diesel: 1.70, hybride: 1.85, electrique: 0.25
        };
        const totalKm = kmPerYear * holdYears;
        const fuelCost = Math.round((consoRates[fuel] / 100) * totalKm * fuelPrices[fuel]);

        // Insurance
        const totalInsurance = insurance * holdYears;

        // Maintenance
        const maintenanceRates: Record<string, number> = {
            essence: 0.04, diesel: 0.045, hybride: 0.035, electrique: 0.02
        };
        const totalMaintenance = Math.round(maintenanceRates[fuel] * totalKm);

        // CT
        const ctCost = holdYears >= 2 ? 80 * Math.floor(holdYears / 2) : 0;

        // Tires
        const tireSets = Math.ceil(totalKm / 40000);
        const tireCost = tireSets * 500;

        // Parking & Péages
        const totalParking = parkingPerMonth * 12 * holdYears;
        const totalPeages = peagesPerMonth * 12 * holdYears;

        // Credit cost (simplified: total interest over hold period)
        const totalCredit = creditRate > 0 ? Math.round(purchasePrice * (creditRate / 100) * holdYears * 0.55) : 0;
        // 0.55 factor: average outstanding balance over amortizing loan

        const totalCost = totalDepreciation + fuelCost + totalInsurance + totalMaintenance + ctCost + tireCost + totalParking + totalPeages + totalCredit;
        const costPerMonth = Math.round(totalCost / (holdYears * 12));
        const costPerKm = Math.round((totalCost / totalKm) * 100) / 100;

        return {
            depreciation: Math.round(totalDepreciation),
            fuelCost,
            insurance: totalInsurance,
            maintenance: totalMaintenance,
            ct: ctCost,
            tires: tireCost,
            parking: totalParking,
            peages: totalPeages,
            credit: totalCredit,
            total: Math.round(totalCost),
            costPerMonth,
            costPerKm,
            residualValue: Math.round(currentValue),
            estimatedNewPrice,
        };
    }, [purchasePrice, vehicleAge, kmPerYear, holdYears, fuel, insurance, parkingPerMonth, peagesPerMonth, creditRate]);

    const formatEuro = (n: number) => n.toLocaleString('fr-FR') + ' €';

    // Breakdown for chart
    const breakdown = [
        { label: 'Décote', value: results.depreciation, color: 'bg-red-500', pct: Math.round(results.depreciation / results.total * 100) },
        { label: 'Carburant', value: results.fuelCost, color: 'bg-orange-500', pct: Math.round(results.fuelCost / results.total * 100) },
        { label: 'Assurance', value: results.insurance, color: 'bg-blue-500', pct: Math.round(results.insurance / results.total * 100) },
        { label: 'Entretien', value: results.maintenance, color: 'bg-yellow-500', pct: Math.round(results.maintenance / results.total * 100) },
        { label: 'Pneus', value: results.tires, color: 'bg-purple-500', pct: Math.round(results.tires / results.total * 100) },
        { label: 'CT', value: results.ct, color: 'bg-slate-500', pct: Math.round(results.ct / results.total * 100) },
        ...(results.parking > 0 ? [{ label: 'Parking', value: results.parking, color: 'bg-teal-500', pct: Math.round(results.parking / results.total * 100) }] : []),
        ...(results.peages > 0 ? [{ label: 'Péages', value: results.peages, color: 'bg-amber-500', pct: Math.round(results.peages / results.total * 100) }] : []),
        ...(results.credit > 0 ? [{ label: 'Crédit', value: results.credit, color: 'bg-pink-500', pct: Math.round(results.credit / results.total * 100) }] : []),
    ];

    return (
        <>
            <Helmet>
                <title>Simulateur Coût d'Utilisation — Budget Auto Annuel — Doitz</title>
                <meta name="description" content="Calculez le vrai coût de votre voiture : décote, carburant, assurance, entretien, pneus. Simulateur de budget auto complet." />
            </Helmet>

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Wallet size={14} />
                            OUTIL INTERACTIF
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Simulateur <span className="text-gradient">Coût d'Utilisation</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Le vrai coût de votre voiture : décote + carburant + assurance + entretien. Combien payez-vous réellement ?
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Inputs — col span 2 */}
                        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-5 h-fit">
                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Prix d'achat : <span className="text-white text-lg">{formatEuro(purchasePrice)}</span>
                                </label>
                                <input type="range" min={3000} max={100000} step={1000} value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Âge à l'achat : <span className="text-white text-lg">{vehicleAge} ans</span>
                                </label>
                                <input type="range" min={0} max={15} value={vehicleAge}
                                    onChange={(e) => setVehicleAge(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Durée de possession : <span className="text-white text-lg">{holdYears} ans</span>
                                </label>
                                <input type="range" min={1} max={10} value={holdYears}
                                    onChange={(e) => setHoldYears(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Km / an : <span className="text-white text-lg">{kmPerYear.toLocaleString('fr-FR')} km</span>
                                </label>
                                <input type="range" min={5000} max={40000} step={1000} value={kmPerYear}
                                    onChange={(e) => setKmPerYear(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Carburant</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['essence', 'diesel', 'hybride', 'electrique'] as const).map((f) => (
                                        <button key={f} onClick={() => setFuel(f)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${fuel === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Assurance / an : <span className="text-white text-lg">{formatEuro(insurance)}</span>
                                </label>
                                <input type="range" min={300} max={3000} step={50} value={insurance}
                                    onChange={(e) => setInsurance(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Parking / mois : <span className="text-white text-lg">{parkingPerMonth === 0 ? 'Gratuit' : formatEuro(parkingPerMonth)}</span>
                                </label>
                                <input type="range" min={0} max={300} step={10} value={parkingPerMonth}
                                    onChange={(e) => setParkingPerMonth(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Péages / mois : <span className="text-white text-lg">{peagesPerMonth === 0 ? 'Aucun' : formatEuro(peagesPerMonth)}</span>
                                </label>
                                <input type="range" min={0} max={250} step={10} value={peagesPerMonth}
                                    onChange={(e) => setPeagesPerMonth(Number(e.target.value))} className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Taux crédit : <span className="text-white text-lg">{creditRate === 0 ? 'Comptant' : creditRate.toFixed(1) + '%'}</span>
                                </label>
                                <input type="range" min={0} max={10} step={0.5} value={creditRate}
                                    onChange={(e) => setCreditRate(Number(e.target.value))} className="range-slider" />
                                {creditRate > 0 && (
                                    <p className="text-[10px] text-slate-500 mt-1">Coût du crédit estimé : ~{formatEuro(results.credit)} sur {holdYears} ans</p>
                                )}
                            </div>
                        </div>

                        {/* Results — col span 3 */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Big numbers */}
                            <div className="grid grid-cols-3 gap-4">
                                <motion.div key={results.costPerMonth} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                                    className="glass-panel rounded-2xl p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Coût / mois</div>
                                    <div className="text-2xl md:text-3xl font-bold text-gradient font-display tabular-nums">{formatEuro(results.costPerMonth)}</div>
                                </motion.div>
                                <motion.div key={results.costPerKm} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                                    className="glass-panel rounded-2xl p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Coût / km</div>
                                    <div className="text-2xl md:text-3xl font-bold text-white font-display tabular-nums">{results.costPerKm} €</div>
                                </motion.div>
                                <motion.div key={results.total} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                                    className="glass-panel rounded-2xl p-4 text-center">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total / {holdYears}a</div>
                                    <div className="text-2xl md:text-3xl font-bold text-white font-display tabular-nums">{formatEuro(results.total)}</div>
                                </motion.div>
                            </div>

                            {/* Bar chart breakdown */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-white font-display mb-4">Répartition des coûts</h3>
                                {/* Stacked bar */}
                                <div className="flex h-8 rounded-full overflow-hidden mb-4">
                                    {breakdown.map((b) => (
                                        <div key={b.label} className={`${b.color} transition-all`} style={{ width: `${b.pct}%` }}
                                            title={`${b.label}: ${b.pct}%`} />
                                    ))}
                                </div>
                                {/* Legend */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {breakdown.map((b) => (
                                        <div key={b.label} className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-sm ${b.color}`} />
                                            <span className="text-xs text-slate-300">{b.label}</span>
                                            <span className="text-xs text-white font-bold ml-auto tabular-nums">{formatEuro(b.value)}</span>
                                            <span className="text-[10px] text-slate-500">({b.pct}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Insight */}
                            <div className="glass-panel rounded-2xl p-5 border-l-4 border-blue-500">
                                <h3 className="text-sm font-bold text-white font-display mb-2 flex items-center gap-2">
                                    <TrendingDown size={16} className="text-blue-400" />
                                    Conseil consommateur
                                </h3>
                                <p className="text-sm text-slate-300">
                                    La <strong className="text-red-400">décote représente {breakdown[0].pct}%</strong> du coût total.
                                    {vehicleAge < 2
                                        ? " Acheter un véhicule plus âgé (2-3 ans) réduirait considérablement ce poste. Essayez en changeant l'âge du véhicule ci-dessus !"
                                        : " Bonne stratégie : un véhicule de " + vehicleAge + " ans a déjà absorbé le gros de la décote."}
                                </p>
                                <p className="text-sm text-slate-300 mt-2">
                                    Valeur résiduelle estimée : <strong className="text-green-400">{formatEuro(results.residualValue)}</strong>
                                </p>
                                {(parkingPerMonth > 0 || peagesPerMonth > 0) && (
                                    <p className="text-sm text-amber-300 mt-2">
                                        ⚠️ Parking + péages ajoutent <strong>{formatEuro(results.parking + results.peages)}</strong> sur {holdYears} ans — {Math.round((results.parking + results.peages) / results.total * 100)}% du coût total.
                                    </p>
                                )}
                                {creditRate > 0 && (
                                    <p className="text-sm text-pink-300 mt-2">
                                        💳 Le crédit à {creditRate}% ajoute <strong>{formatEuro(results.credit)}</strong> au coût total. Envisagez un apport plus élevé ou une durée plus courte.
                                    </p>
                                )}
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-3">
                                <Link to="/outils/simulateur-financement" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Simulateur financement
                                </Link>
                                <Link to="/outils/simulateur-carburant" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Simulateur carburant
                                </Link>
                                <Link to="/blog/cout-possession-voiture-annuel" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                                    → Article coût de possession
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SimulateurCoutUtilisation;
