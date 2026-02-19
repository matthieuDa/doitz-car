import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/utils/structuredData';
import { SITE_URL } from '@/utils/constants';

const regions: Record<string, number> = {
    'Île-de-France': 54.95,
    'Auvergne-Rhône-Alpes': 43.00,
    'Bourgogne-Franche-Comté': 51.00,
    'Bretagne': 55.00,
    'Centre-Val de Loire': 55.00,
    'Corse': 43.00,
    'Grand Est': 48.00,
    'Hauts-de-France': 36.20,
    'Normandie': 46.00,
    'Nouvelle-Aquitaine': 45.00,
    'Occitanie': 47.00,
    'Pays de la Loire': 48.00,
    'Provence-Alpes-Côte d\'Azur': 51.20,
    'Guadeloupe': 41.00,
    'Martinique': 30.00,
    'Guyane': 42.50,
    'La Réunion': 51.00,
    'Mayotte': 30.00,
};

const malusBareme2026: [number, number][] = [
    [118, 50], [119, 75], [120, 100], [121, 125], [122, 150],
    [123, 170], [124, 190], [125, 210], [126, 230], [127, 240],
    [128, 260], [129, 280], [130, 310], [131, 330], [132, 360],
    [133, 400], [134, 450], [135, 540], [136, 650], [137, 740],
    [138, 818], [139, 898], [140, 983], [141, 1074], [142, 1172],
    [143, 1276], [144, 1386], [145, 1504], [146, 1629], [147, 1761],
    [148, 1901], [149, 2049], [150, 2205], [155, 3784], [160, 6224],
    [165, 9953], [170, 15462], [175, 23490], [180, 34770], [190, 50000],
    [200, 60000],
];

const FAQ_DATA = [
    { question: 'Comment est calculé le prix de la carte grise en 2026 ?', answer: 'Le prix de la carte grise se compose de 5 taxes : la taxe régionale (Y1), le malus écologique CO2 (Y3), la taxe de gestion fixe (Y4 = 11€), la redevance d\'acheminement (Y5 = 2,76€) et le malus au poids pour les véhicules neufs de plus de 1 800 kg (Y6). Le montant varie selon votre région, la puissance fiscale et les émissions CO2.' },
    { question: 'Les véhicules électriques paient-ils la carte grise ?', answer: 'Les véhicules 100% électriques bénéficient d\'une exonération totale de la taxe régionale et du malus au poids. Ils ne paient que la taxe de gestion (11€) et la redevance d\'acheminement (2,76€), soit un total de 13,76€ seulement.' },
    { question: 'Quel est le malus écologique en 2026 ?', answer: 'En 2026, le malus écologique s\'applique à partir de 118 g/km de CO2 (50€) et peut atteindre 60 000€ pour les véhicules émettant plus de 200 g/km. Il ne s\'applique qu\'aux véhicules neufs ou importés de moins d\'un an.' },
    { question: 'La carte grise est-elle moins chère pour un véhicule d\'occasion ?', answer: 'Oui, les véhicules d\'occasion de plus de 10 ans bénéficient d\'un demi-tarif sur la taxe régionale. De plus, le malus écologique et le malus au poids ne s\'appliquent plus aux véhicules d\'occasion.' },
    { question: 'Comment fonctionne le malus au poids 2026 ?', answer: 'Le malus au poids s\'applique aux véhicules neufs pesant plus de 1 800 kg, à raison de 10€ par kg excédentaire. Les véhicules électriques en sont exemptés. Les hybrides rechargeables émettant moins de 50 g/km bénéficient d\'un abattement de 200 kg.' },
];

const SimulateurCarteGrise = () => {
    const [region, setRegion] = useState('Île-de-France');
    const [puissanceFiscale, setPuissanceFiscale] = useState(6);
    const [co2, setCo2] = useState(120);
    const [weight, setWeight] = useState(1400);
    const [fuel, setFuel] = useState<'essence' | 'diesel' | 'hybride' | 'electrique'>('essence');
    const [isNew, setIsNew] = useState(false);
    const [age, setAge] = useState(3);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const results = useMemo(() => {
        const tarifRegional = regions[region] || 46;
        let y1 = puissanceFiscale * tarifRegional;
        if (fuel === 'electrique') y1 = 0;
        if (fuel === 'hybride') y1 = y1 * 0.5;
        if (age >= 10) y1 = y1 * 0.5;

        const y2 = 0;
        let y3 = 0;
        if (isNew || age <= 0) {
            for (const [threshold, amount] of malusBareme2026) {
                if (co2 >= threshold) y3 = amount;
            }
        }

        const y4 = 11;
        const y5 = 2.76;

        let y6 = 0;
        if ((isNew || age <= 0) && weight > 1800 && fuel !== 'electrique') {
            const effectiveWeight = (fuel === 'hybride' && co2 <= 50) ? weight - 200 : weight;
            if (effectiveWeight > 1800) {
                y6 = (effectiveWeight - 1800) * 10;
            }
        }

        const total = y1 + y2 + y3 + y4 + y5 + y6;
        return { y1: Math.round(y1), y3: Math.round(y3), y4, y5, y6: Math.round(y6), total: Math.round(total * 100) / 100 };
    }, [region, puissanceFiscale, co2, weight, fuel, isNew, age]);

    const pageUrl = `${SITE_URL}/outils/simulateur-carte-grise`;

    return (
        <>
            <SEO
                title="Simulateur Carte Grise 2026 — Calcul du Prix par Région"
                description="Calculez le prix exact de votre carte grise en 2026 : taxe régionale, malus CO2, malus au poids, frais de gestion. Simulateur gratuit pour toutes les régions de France."
                canonical={pageUrl}
                keywords={['carte grise', 'simulateur carte grise', 'prix carte grise 2026', 'malus écologique', 'taxe régionale', 'malus au poids']}
                schema={[
                    generateWebApplicationSchema('Simulateur Carte Grise 2026', 'Calculez le prix de votre carte grise en 2026 : taxe régionale, malus CO2, malus au poids. Toutes les régions françaises.', pageUrl, ['carte grise', 'simulateur', 'malus CO2', 'taxe régionale']),
                    generateFAQSchema(FAQ_DATA),
                ]}
                breadcrumbs={generateBreadcrumbSchema([
                    { name: 'Accueil', url: SITE_URL },
                    { name: 'Outils', url: `${SITE_URL}/outils` },
                    { name: 'Simulateur Carte Grise', url: pageUrl },
                ])}
            />

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <FileText size={14} />
                            OUTIL INTERACTIF
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Simulateur <span className="text-gradient">Carte Grise</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Calculez le coût exact de votre carte grise en 2026, région par région, malus inclus. DOM/TOM compris.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="glass-panel rounded-3xl p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Région</label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <optgroup label="Métropole">
                                        {Object.keys(regions).filter(r => !['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'].includes(r)).map((r) => (
                                            <option key={r} value={r}>{r} ({regions[r]} €/CV)</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="DOM/TOM">
                                        {['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'].map((r) => (
                                            <option key={r} value={r}>{r} ({regions[r]} €/CV)</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Puissance fiscale : <span className="text-white text-lg">{puissanceFiscale} CV</span>
                                </label>
                                <input type="range" min={1} max={30} value={puissanceFiscale} onChange={(e) => setPuissanceFiscale(Number(e.target.value))}
                                    className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Émissions CO2 : <span className="text-white text-lg">{co2} g/km</span>
                                </label>
                                <input type="range" min={0} max={300} step={1} value={co2} onChange={(e) => setCo2(Number(e.target.value))}
                                    className="range-slider" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Carburant</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['essence', 'diesel', 'hybride', 'electrique'] as const).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFuel(f)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${fuel === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                }`}
                                        >
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                    Poids du véhicule : <span className="text-white text-lg">{weight.toLocaleString('fr-FR')} kg</span>
                                </label>
                                <input type="range" min={800} max={2800} step={10} value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                                    className="range-slider" />
                                {weight > 1800 && fuel !== 'electrique' && isNew && (
                                    <div className="mt-1 p-2 bg-red-500/10 rounded-lg">
                                        <p className="text-[11px] text-red-300">⚠️ Malus au poids : {(weight - 1800)} kg × 10€ = {((weight - 1800) * 10).toLocaleString('fr-FR')}€  (exempté si EV)</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">Type</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setIsNew(true); setAge(0); }}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isNew ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                            Neuf
                                        </button>
                                        <button onClick={() => { setIsNew(false); setAge(3); }}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isNew ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                            Occasion
                                        </button>
                                    </div>
                                </div>
                                {!isNew && (
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-display block mb-2">
                                            Âge : <span className="text-white">{age} ans</span>
                                        </label>
                                        <input type="range" min={1} max={20} value={age} onChange={(e) => setAge(Number(e.target.value))}
                                            className="range-slider" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-panel rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                                <Calculator size={20} className="text-blue-400" />
                                Détail du coût
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-slate-400">Y1 — Taxe régionale ({puissanceFiscale} CV × {regions[region]}€)</span>
                                    <span className="text-white font-bold tabular-nums">{results.y1.toLocaleString('fr-FR')} €</span>
                                </div>
                                {results.y3 > 0 && (
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-sm text-red-400">Y3 — Malus écologique ({co2} g/km)</span>
                                        <span className="text-red-400 font-bold tabular-nums">{results.y3.toLocaleString('fr-FR')} €</span>
                                    </div>
                                )}
                                {results.y6 > 0 && (
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-sm text-red-400">Y6 — Malus au poids ({weight.toLocaleString('fr-FR')} kg)</span>
                                        <span className="text-red-400 font-bold tabular-nums">{results.y6.toLocaleString('fr-FR')} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-slate-400">Y4 — Taxe de gestion</span>
                                    <span className="text-white font-bold tabular-nums">{results.y4} €</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-slate-400">Y5 — Redevance d'acheminement</span>
                                    <span className="text-white font-bold tabular-nums">{results.y5} €</span>
                                </div>
                                {fuel === 'electrique' && (
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <p className="text-xs text-green-300">✅ Véhicule électrique : exonération totale de la taxe régionale + malus poids</p>
                                    </div>
                                )}
                                {fuel === 'hybride' && (
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <p className="text-xs text-green-300">✅ Véhicule hybride : exonération de 50% de la taxe régionale{co2 <= 50 ? ' + abattement 200 kg sur le malus poids' : ''}</p>
                                    </div>
                                )}
                                {results.y3 + results.y6 > 3000 && (
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <p className="text-xs text-amber-300">⚠️ Malus total élevé ({(results.y3 + results.y6).toLocaleString('fr-FR')}€). Si vous importez ce véhicule, anticipez ce coût qui s'ajoute au prix d'achat !</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-white font-display">TOTAL</span>
                                    <motion.span
                                        key={results.total}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-3xl font-bold text-gradient font-display tabular-nums"
                                    >
                                        {results.total.toLocaleString('fr-FR')} €
                                    </motion.span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Link to="/blog/carte-grise-vehicule-importe" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Carte grise véhicule importé : guide complet
                                </Link>
                                <Link to="/blog/malus-ecologique-eviter" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Comment éviter le malus écologique
                                </Link>
                                <Link to="/blog/quitus-fiscal-vehicule-importe" className="block text-xs text-blue-400 hover:text-blue-300">
                                    → Quitus fiscal véhicule importé
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
                                    <button
                                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
                                        {faqOpen === i ? <ChevronUp size={18} className="text-blue-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                    </button>
                                    {faqOpen === i && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            className="px-5 pb-5">
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

export default SimulateurCarteGrise;
