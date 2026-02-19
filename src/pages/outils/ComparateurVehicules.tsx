import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Search, Car, Fuel, Gauge, Box, Zap, Shield, Calculator } from 'lucide-react';

/* ─── Vehicle Database ─── */
interface Vehicle {
    id: string;
    name: string;
    brand: string;
    category: string;
    priceNeuf: number;
    priceOccasion3ans: number;
    motorisation: string;
    puissance: number;
    couple: number;
    conso: number; // L/100km or kWh/100km
    co2: number;
    coffre: number;
    poids: number;
    longueur: number;
    reservoir: number; // L or kWh
    autonomie: number;
    puissanceFiscale: number;
    critair: number;
    fiabilite: number; // 1-5
    equipements: string[];
    image: string;
}

const vehicleDB: Vehicle[] = [
    // ── Citadines ──
    { id: 'clio5', name: 'Renault Clio V', brand: 'Renault', category: 'Citadine', priceNeuf: 22000, priceOccasion3ans: 14500, motorisation: 'Essence 1.0 TCe 90', puissance: 90, couple: 160, conso: 5.2, co2: 118, coffre: 391, poids: 1150, longueur: 4050, reservoir: 42, autonomie: 808, puissanceFiscale: 5, critair: 1, fiabilite: 4, equipements: ['Écran 9.3"', 'GPS', 'Caméra recul', 'Régulateur adaptatif'], image: '' },
    { id: 'clio5-hybrid', name: 'Renault Clio V E-Tech', brand: 'Renault', category: 'Citadine', priceNeuf: 27500, priceOccasion3ans: 18500, motorisation: 'Hybride 140ch', puissance: 140, couple: 205, conso: 4.2, co2: 96, coffre: 391, poids: 1280, longueur: 4050, reservoir: 36, autonomie: 857, puissanceFiscale: 6, critair: 1, fiabilite: 4, equipements: ['Hybride auto', 'Écran 9.3"', 'GPS', 'Caméra', 'Régulateur'], image: '' },
    { id: '208', name: 'Peugeot 208', brand: 'Peugeot', category: 'Citadine', priceNeuf: 22800, priceOccasion3ans: 15000, motorisation: 'Essence 1.2 PureTech 100', puissance: 100, couple: 205, conso: 5.0, co2: 114, coffre: 309, poids: 1100, longueur: 4055, reservoir: 44, autonomie: 880, puissanceFiscale: 5, critair: 1, fiabilite: 3, equipements: ['i-Cockpit 3D', 'Écran 10"', 'GPS', 'Caméra recul'], image: '' },
    { id: 'e208', name: 'Peugeot e-208', brand: 'Peugeot', category: 'Citadine', priceNeuf: 35600, priceOccasion3ans: 22000, motorisation: 'Électrique 156ch', puissance: 156, couple: 260, conso: 15.4, co2: 0, coffre: 309, poids: 1530, longueur: 4055, reservoir: 51, autonomie: 400, puissanceFiscale: 1, critair: 0, fiabilite: 4, equipements: ['i-Cockpit 3D', 'Charge rapide 100kW', 'Pompe chaleur', 'GPS'], image: '' },
    { id: 'yaris', name: 'Toyota Yaris', brand: 'Toyota', category: 'Citadine', priceNeuf: 24950, priceOccasion3ans: 17000, motorisation: 'Hybride 116ch', puissance: 116, couple: 120, conso: 3.8, co2: 87, coffre: 286, poids: 1100, longueur: 3940, reservoir: 36, autonomie: 947, puissanceFiscale: 5, critair: 1, fiabilite: 5, equipements: ['Toyota Safety Sense', 'Écran 8"', 'JBL audio', 'Caméra 360°'], image: '' },
    { id: 'c3', name: 'Citroën C3', brand: 'Citroën', category: 'Citadine', priceNeuf: 17990, priceOccasion3ans: 11500, motorisation: 'Essence 1.2 PureTech 83', puissance: 83, couple: 118, conso: 5.3, co2: 120, coffre: 300, poids: 1050, longueur: 3981, reservoir: 44, autonomie: 830, puissanceFiscale: 4, critair: 1, fiabilite: 3, equipements: ['Écran 10"', 'Apple CarPlay', 'Régulateur', 'Suspension Advanced Comfort'], image: '' },
    { id: 'corsa', name: 'Opel Corsa', brand: 'Opel', category: 'Citadine', priceNeuf: 21200, priceOccasion3ans: 13500, motorisation: 'Essence 1.2 Turbo 100', puissance: 100, couple: 205, conso: 5.1, co2: 116, coffre: 309, poids: 1120, longueur: 4060, reservoir: 44, autonomie: 863, puissanceFiscale: 5, critair: 1, fiabilite: 3, equipements: ['Écran 10"', 'IntelliLux LED', 'Caméra recul', 'Park Assist'], image: '' },
    { id: 'fiat500e', name: 'Fiat 500e', brand: 'Fiat', category: 'Citadine', priceNeuf: 30400, priceOccasion3ans: 18000, motorisation: 'Électrique 118ch', puissance: 118, couple: 220, conso: 14.0, co2: 0, coffre: 185, poids: 1320, longueur: 3631, reservoir: 42, autonomie: 320, puissanceFiscale: 1, critair: 0, fiabilite: 3, equipements: ['Écran 10.25"', 'UConnect', 'Charge 85kW', 'Caméra 360°'], image: '' },
    { id: 'spring', name: 'Dacia Spring', brand: 'Dacia', category: 'Citadine', priceNeuf: 18900, priceOccasion3ans: 10000, motorisation: 'Électrique 65ch', puissance: 65, couple: 113, conso: 14.6, co2: 0, coffre: 308, poids: 1073, longueur: 3734, reservoir: 26.8, autonomie: 225, puissanceFiscale: 1, critair: 0, fiabilite: 3, equipements: ['Écran 7"', 'Caméra recul', 'Clim auto', 'Charge 30kW'], image: '' },
    { id: 'r5etec', name: 'Renault 5 E-Tech', brand: 'Renault', category: 'Citadine', priceNeuf: 25000, priceOccasion3ans: 18500, motorisation: 'Électrique 150ch', puissance: 150, couple: 245, conso: 14.9, co2: 0, coffre: 326, poids: 1449, longueur: 3920, reservoir: 52, autonomie: 410, puissanceFiscale: 1, critair: 0, fiabilite: 4, equipements: ['OpenR Link', 'Google intégré', 'Charge 100kW', 'Regen adaptatif'], image: '' },

    // ── Compactes ──
    { id: '308', name: 'Peugeot 308', brand: 'Peugeot', category: 'Compacte', priceNeuf: 30200, priceOccasion3ans: 20000, motorisation: 'Essence 1.2 PureTech 130', puissance: 130, couple: 230, conso: 5.6, co2: 127, coffre: 412, poids: 1300, longueur: 4367, reservoir: 52, autonomie: 929, puissanceFiscale: 7, critair: 1, fiabilite: 3, equipements: ['i-Cockpit', 'Écran 10"', 'GPS 3D', 'ADAS niveau 2'], image: '' },
    { id: 'golf8', name: 'Volkswagen Golf 8', brand: 'Volkswagen', category: 'Compacte', priceNeuf: 33000, priceOccasion3ans: 22500, motorisation: 'Essence 1.5 TSI 150', puissance: 150, couple: 250, conso: 5.5, co2: 125, coffre: 381, poids: 1335, longueur: 4284, reservoir: 50, autonomie: 909, puissanceFiscale: 7, critair: 1, fiabilite: 4, equipements: ['Digital Cockpit', 'Écran 10.25"', 'Travel Assist', 'Matrix LED'], image: '' },
    { id: 'megane-etec', name: 'Renault Megane E-Tech', brand: 'Renault', category: 'Compacte', priceNeuf: 38000, priceOccasion3ans: 24000, motorisation: 'Électrique 220ch', puissance: 220, couple: 300, conso: 16.1, co2: 0, coffre: 440, poids: 1636, longueur: 4200, reservoir: 60, autonomie: 450, puissanceFiscale: 1, critair: 0, fiabilite: 4, equipements: ['OpenR Link', 'Google intégré', 'Charge 130kW', 'ADAS avancé'], image: '' },
    { id: 'model3', name: 'Tesla Model 3', brand: 'Tesla', category: 'Compacte', priceNeuf: 42990, priceOccasion3ans: 30000, motorisation: 'Électrique 283ch', puissance: 283, couple: 420, conso: 14.0, co2: 0, coffre: 561, poids: 1761, longueur: 4720, reservoir: 60, autonomie: 510, puissanceFiscale: 1, critair: 0, fiabilite: 3, equipements: ['Autopilot', 'Écran 15.4"', 'Supercharge 250kW', 'Mises à jour OTA'], image: '' },
    { id: 'corolla', name: 'Toyota Corolla', brand: 'Toyota', category: 'Compacte', priceNeuf: 33500, priceOccasion3ans: 24000, motorisation: 'Hybride 140ch', puissance: 140, couple: 185, conso: 4.5, co2: 102, coffre: 361, poids: 1370, longueur: 4370, reservoir: 43, autonomie: 956, puissanceFiscale: 6, critair: 1, fiabilite: 5, equipements: ['Safety Sense 3', 'Écran 10.5"', 'JBL audio', 'Caméra 360°'], image: '' },
    { id: 'kiaceed', name: 'Kia Ceed', brand: 'Kia', category: 'Compacte', priceNeuf: 28500, priceOccasion3ans: 18000, motorisation: 'Essence 1.5 T-GDi 160', puissance: 160, couple: 253, conso: 5.8, co2: 132, coffre: 395, poids: 1335, longueur: 4310, reservoir: 50, autonomie: 862, puissanceFiscale: 7, critair: 1, fiabilite: 4, equipements: ['Écran 12.3"', 'Navigation', 'ADAS complet', 'Garantie 7 ans'], image: '' },
    { id: 'octavia', name: 'Skoda Octavia', brand: 'Skoda', category: 'Compacte', priceNeuf: 30800, priceOccasion3ans: 20000, motorisation: 'Essence 1.5 TSI 150', puissance: 150, couple: 250, conso: 5.4, co2: 122, coffre: 600, poids: 1380, longueur: 4689, reservoir: 50, autonomie: 926, puissanceFiscale: 7, critair: 1, fiabilite: 4, equipements: ['Virtual Cockpit', 'Écran 10"', 'Navigation', 'Coffre 600L'], image: '' },
    { id: 'id3', name: 'Volkswagen ID.3', brand: 'Volkswagen', category: 'Compacte', priceNeuf: 37990, priceOccasion3ans: 23000, motorisation: 'Électrique 204ch', puissance: 204, couple: 310, conso: 15.5, co2: 0, coffre: 385, poids: 1805, longueur: 4261, reservoir: 58, autonomie: 425, puissanceFiscale: 1, critair: 0, fiabilite: 3, equipements: ['Écran 12"', 'ID. Light', 'Charge 120kW', 'Travel Assist'], image: '' },

    // ── SUV Compacts ──
    { id: '3008', name: 'Peugeot 3008', brand: 'Peugeot', category: 'SUV Compact', priceNeuf: 36500, priceOccasion3ans: 24000, motorisation: 'Hybride 136ch', puissance: 136, couple: 230, conso: 4.7, co2: 108, coffre: 520, poids: 1490, longueur: 4447, reservoir: 53, autonomie: 1128, puissanceFiscale: 7, critair: 1, fiabilite: 3, equipements: ['i-Cockpit', 'Panoramique', 'Night Vision', 'Drive Assist 2.0'], image: '' },
    { id: 'tucson', name: 'Hyundai Tucson', brand: 'Hyundai', category: 'SUV Compact', priceNeuf: 36300, priceOccasion3ans: 24500, motorisation: 'Hybride 230ch', puissance: 230, couple: 350, conso: 5.7, co2: 129, coffre: 620, poids: 1575, longueur: 4500, reservoir: 54, autonomie: 947, puissanceFiscale: 6, critair: 1, fiabilite: 4, equipements: ['Écran 10.25"', 'Digital Cockpit', 'Blulink connect', 'ADAS complet'], image: '' },
    { id: 'rav4', name: 'Toyota RAV4', brand: 'Toyota', category: 'SUV Compact', priceNeuf: 40500, priceOccasion3ans: 28000, motorisation: 'Hybride 218ch AWD', puissance: 218, couple: 221, conso: 5.6, co2: 127, coffre: 580, poids: 1710, longueur: 4600, reservoir: 55, autonomie: 982, puissanceFiscale: 8, critair: 1, fiabilite: 5, equipements: ['Toyota Safety Sense', 'AWD-i', 'JBL Premium', 'Hayon motorisé'], image: '' },
    { id: 'duster3', name: 'Dacia Duster III', brand: 'Dacia', category: 'SUV Compact', priceNeuf: 19990, priceOccasion3ans: 15500, motorisation: 'Hybride 140ch', puissance: 140, couple: 205, conso: 4.7, co2: 107, coffre: 479, poids: 1340, longueur: 4343, reservoir: 50, autonomie: 1064, puissanceFiscale: 6, critair: 1, fiabilite: 4, equipements: ['YouMedia 10.1"', 'GPS', 'Caméra recul', 'Sleep Pack'], image: '' },
    { id: 'captur', name: 'Renault Captur', brand: 'Renault', category: 'SUV Compact', priceNeuf: 27500, priceOccasion3ans: 17500, motorisation: 'Essence 1.3 TCe 140', puissance: 140, couple: 260, conso: 5.8, co2: 132, coffre: 536, poids: 1300, longueur: 4227, reservoir: 48, autonomie: 828, puissanceFiscale: 7, critair: 1, fiabilite: 3, equipements: ['Écran 9.3"', 'Easy Link', 'Caméra recul', 'Banquette coulissante'], image: '' },
    { id: 'c5aircross', name: 'Citroën C5 Aircross', brand: 'Citroën', category: 'SUV Compact', priceNeuf: 31400, priceOccasion3ans: 19500, motorisation: 'Essence 1.2 PureTech 130', puissance: 130, couple: 230, conso: 6.1, co2: 138, coffre: 580, poids: 1415, longueur: 4500, reservoir: 53, autonomie: 869, puissanceFiscale: 7, critair: 1, fiabilite: 3, equipements: ['Suspension Advanced Comfort', 'Écran 10"', 'Grip Control', 'Advanced Comfort'], image: '' },
    { id: 'sportage', name: 'Kia Sportage', brand: 'Kia', category: 'SUV Compact', priceNeuf: 35500, priceOccasion3ans: 24000, motorisation: 'Hybride 230ch', puissance: 230, couple: 350, conso: 5.3, co2: 120, coffre: 587, poids: 1617, longueur: 4515, reservoir: 54, autonomie: 1019, puissanceFiscale: 6, critair: 1, fiabilite: 4, equipements: ['Écran courbe 12.3"', 'Navigation', 'ADAS complet', 'Garantie 7 ans'], image: '' },
    { id: 'ateca', name: 'SEAT Ateca', brand: 'SEAT', category: 'SUV Compact', priceNeuf: 31200, priceOccasion3ans: 20500, motorisation: 'Essence 1.5 TSI 150', puissance: 150, couple: 250, conso: 6.0, co2: 136, coffre: 510, poids: 1400, longueur: 4363, reservoir: 50, autonomie: 833, puissanceFiscale: 7, critair: 1, fiabilite: 4, equipements: ['Digital Cockpit', 'Écran 9.2"', 'Full Link', 'Drive Profile'], image: '' },
    { id: 'modely', name: 'Tesla Model Y', brand: 'Tesla', category: 'SUV Compact', priceNeuf: 46990, priceOccasion3ans: 33000, motorisation: 'Électrique 299ch', puissance: 299, couple: 420, conso: 15.7, co2: 0, coffre: 854, poids: 1909, longueur: 4751, reservoir: 60, autonomie: 455, puissanceFiscale: 1, critair: 0, fiabilite: 3, equipements: ['Autopilot', 'Écran 15.4"', 'Supercharge 250kW', '7 places opt.'], image: '' },

    // ── Berlines ──
    { id: 'serie3', name: 'BMW Série 3 (G20)', brand: 'BMW', category: 'Berline', priceNeuf: 47000, priceOccasion3ans: 32000, motorisation: 'Diesel 320d 190ch', puissance: 190, couple: 400, conso: 4.7, co2: 123, coffre: 480, poids: 1570, longueur: 4709, reservoir: 59, autonomie: 1255, puissanceFiscale: 9, critair: 2, fiabilite: 4, equipements: ['iDrive 8', 'Live Cockpit Pro', 'Driving Assistant', 'HUD'], image: '' },
    { id: 'classeC', name: 'Mercedes Classe C (W206)', brand: 'Mercedes', category: 'Berline', priceNeuf: 52000, priceOccasion3ans: 35000, motorisation: 'Diesel 220d 200ch', puissance: 200, couple: 440, conso: 4.9, co2: 129, coffre: 455, poids: 1680, longueur: 4751, reservoir: 66, autonomie: 1347, puissanceFiscale: 10, critair: 2, fiabilite: 3, equipements: ['MBUX 2', 'Écran 11.9"', 'Burmester', 'ADAS niveau 2+'], image: '' },
    { id: 'a4', name: 'Audi A4 (B9.5)', brand: 'Audi', category: 'Berline', priceNeuf: 45500, priceOccasion3ans: 30000, motorisation: 'Diesel 35 TDI 163ch', puissance: 163, couple: 380, conso: 4.5, co2: 119, coffre: 460, poids: 1555, longueur: 4762, reservoir: 54, autonomie: 1200, puissanceFiscale: 8, critair: 2, fiabilite: 4, equipements: ['Virtual Cockpit', 'MMI Navigation', 'Matrix LED', 'Bang & Olufsen'], image: '' },
    { id: 'classeA', name: 'Mercedes Classe A', brand: 'Mercedes', category: 'Compacte', priceNeuf: 37500, priceOccasion3ans: 24500, motorisation: 'Essence A200 163ch', puissance: 163, couple: 250, conso: 5.8, co2: 132, coffre: 370, poids: 1400, longueur: 4419, reservoir: 43, autonomie: 741, puissanceFiscale: 8, critair: 1, fiabilite: 3, equipements: ['MBUX', 'Écran 10.25"', 'Burmester opt.', 'ADAS avancé'], image: '' },
    { id: 'a3', name: 'Audi A3 Sportback', brand: 'Audi', category: 'Compacte', priceNeuf: 35900, priceOccasion3ans: 24000, motorisation: 'Essence 35 TFSI 150', puissance: 150, couple: 250, conso: 5.6, co2: 127, coffre: 380, poids: 1370, longueur: 4343, reservoir: 50, autonomie: 893, puissanceFiscale: 7, critair: 1, fiabilite: 4, equipements: ['Virtual Cockpit Plus', 'MMI Touch', 'Matrix LED', 'Drive Select'], image: '' },
    { id: 'passat', name: 'Volkswagen Passat', brand: 'Volkswagen', category: 'Berline', priceNeuf: 42500, priceOccasion3ans: 28000, motorisation: 'Diesel 2.0 TDI 150', puissance: 150, couple: 360, conso: 4.6, co2: 121, coffre: 586, poids: 1555, longueur: 4775, reservoir: 66, autonomie: 1435, puissanceFiscale: 8, critair: 2, fiabilite: 4, equipements: ['Digital Cockpit Pro', 'Area View', 'Travel Assist', 'IQ.Light'], image: '' },
];


/* ─── Comparison specs rows ─── */
const specRows: { label: string; key: keyof Vehicle; format?: (v: any) => string; icon?: React.ReactNode; lowerIsBetter?: boolean }[] = [
    { label: 'Prix neuf', key: 'priceNeuf', format: (v) => v.toLocaleString('fr-FR') + ' €', icon: <Gauge size={14} />, lowerIsBetter: true },
    { label: 'Prix occasion ~3 ans', key: 'priceOccasion3ans', format: (v) => v.toLocaleString('fr-FR') + ' €', lowerIsBetter: true },
    { label: 'Motorisation', key: 'motorisation' },
    { label: 'Puissance', key: 'puissance', format: (v) => v + ' ch' },
    { label: 'Couple', key: 'couple', format: (v) => v + ' Nm' },
    { label: 'Consommation', key: 'conso', format: (v) => v + ' L/100km', icon: <Fuel size={14} />, lowerIsBetter: true },
    { label: 'CO₂', key: 'co2', format: (v) => v + ' g/km', lowerIsBetter: true },
    { label: 'Coffre', key: 'coffre', format: (v) => v + ' L', icon: <Box size={14} /> },
    { label: 'Poids', key: 'poids', format: (v) => v.toLocaleString('fr-FR') + ' kg', lowerIsBetter: true },
    { label: 'Longueur', key: 'longueur', format: (v) => (v / 1000).toFixed(2) + ' m' },
    { label: 'Réservoir / Batterie', key: 'reservoir', format: (v) => v + ' L/kWh' },
    { label: 'Autonomie', key: 'autonomie', format: (v) => v + ' km' },
    { label: 'Puissance fiscale', key: 'puissanceFiscale', format: (v) => v + ' CV', lowerIsBetter: true },
    { label: "Crit'Air", key: 'critair', format: (v) => v === 0 ? '⚡ Zéro émission' : 'Crit\'Air ' + v, lowerIsBetter: true },
    { label: 'Fiabilité', key: 'fiabilite', format: (v) => '⭐'.repeat(v) + '☆'.repeat(5 - v), icon: <Shield size={14} /> },
];

const ComparateurVehicules = () => {
    const [selected, setSelected] = useState<string[]>(['clio5', 'yaris', '208']);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [pickerSlot, setPickerSlot] = useState<number>(0);

    const selectedVehicles = selected.map(id => vehicleDB.find(v => v.id === id)).filter(Boolean) as Vehicle[];

    const filteredVehicles = vehicleDB.filter(v =>
        !selected.includes(v.id) &&
        (v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const addVehicle = (id: string) => {
        const newSelected = [...selected];
        newSelected[pickerSlot] = id;
        setSelected(newSelected);
        setShowPicker(false);
        setSearchQuery('');
    };

    const removeVehicle = (index: number) => {
        if (selected.length > 2) {
            setSelected(selected.filter((_, i) => i !== index));
        }
    };

    const openPicker = (slot: number) => {
        setPickerSlot(slot);
        setShowPicker(true);
        setSearchQuery('');
    };

    // Find best/worst per numeric spec
    const getBestWorst = (key: keyof Vehicle, lowerIsBetter?: boolean) => {
        const vals = selectedVehicles.map(v => Number(v[key])).filter(v => !isNaN(v));
        if (vals.length === 0) return { best: -1, worst: -1 };
        const best = lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
        const worst = lowerIsBetter ? Math.max(...vals) : Math.min(...vals);
        return { best, worst };
    };

    return (
        <>
            <Helmet>
                <title>Comparateur de Véhicules — Comparez jusqu'à 5 Voitures — Doitz</title>
                <meta name="description" content="Comparez jusqu'à 5 véhicules côte à côte : prix, consommation, puissance, coffre, fiabilité. L'outil comparateur auto gratuit de Doitz." />
            </Helmet>

            <div className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <Link to="/outils" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={16} /> Retour aux outils
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                            <Car size={14} /> COMPARATEUR
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 font-display tracking-tight">
                            Comparateur <span className="text-gradient">de Véhicules</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Comparez jusqu'à 5 véhicules côte à côte. Prix, conso, coffre, fiabilité — tous les chiffres qui comptent.
                        </p>
                    </div>

                    {/* ── Vehicle selection bar ── */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {selected.map((id, i) => {
                            const v = vehicleDB.find(x => x.id === id);
                            return v ? (
                                <motion.div key={id + i} initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10">
                                    <button onClick={() => openPicker(i)} className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                                        {v.name}
                                    </button>
                                    {selected.length > 2 && (
                                        <button onClick={() => removeVehicle(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                                            <X size={14} />
                                        </button>
                                    )}
                                </motion.div>
                            ) : null;
                        })}
                        {selected.length < 5 && (
                            <button onClick={() => { setPickerSlot(selected.length); setShowPicker(true); setSearchQuery(''); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/10 transition-all">
                                <Plus size={14} /> Ajouter
                            </button>
                        )}
                    </div>

                    {/* ── Vehicle picker modal ── */}
                    <AnimatePresence>
                        {showPicker && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                                onClick={() => setShowPicker(false)}>
                                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                    className="glass-panel rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
                                    onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Search size={18} className="text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher un véhicule..."
                                            autoFocus
                                            className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-sm"
                                        />
                                        <button onClick={() => setShowPicker(false)} className="text-slate-400 hover:text-white">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="overflow-y-auto flex-1 space-y-1">
                                        {filteredVehicles.map(v => (
                                            <button key={v.id} onClick={() => addVehicle(v.id)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Car size={14} className="text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-white">{v.name}</div>
                                                    <div className="text-xs text-slate-500">{v.category} · {v.motorisation}</div>
                                                </div>
                                                <div className="text-xs text-slate-400 tabular-nums">{v.priceNeuf.toLocaleString('fr-FR')} €</div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Comparison table ── */}
                    <div className="overflow-x-auto pb-4">
                        <table className="w-full border-collapse">
                            {/* Header row: vehicle names */}
                            <thead>
                                <tr>
                                    <th className="sticky left-0 bg-brand-dark z-10 w-44 min-w-[176px] p-3 text-left text-xs text-slate-500 uppercase tracking-wider font-display">
                                        Caractéristique
                                    </th>
                                    {selectedVehicles.map((v, i) => (
                                        <th key={v.id + i} className="p-3 text-center min-w-[160px]">
                                            <div className="glass-panel rounded-xl p-3">
                                                <div className="w-10 h-10 mx-auto rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                                                    <Car size={18} className="text-blue-400" />
                                                </div>
                                                <div className="text-sm font-bold text-white font-display">{v.name}</div>
                                                <div className="text-[10px] text-slate-500">{v.category}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specRows.map((spec) => {
                                    const { best, worst } = getBestWorst(spec.key, spec.lowerIsBetter);
                                    return (
                                        <tr key={spec.key} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="sticky left-0 bg-brand-dark z-10 p-3">
                                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                                    {spec.icon}
                                                    {spec.label}
                                                </div>
                                            </td>
                                            {selectedVehicles.map((v, i) => {
                                                const raw = v[spec.key];
                                                const numVal = Number(raw);
                                                const isBest = !isNaN(numVal) && numVal === best && selectedVehicles.length > 1;
                                                const isWorst = !isNaN(numVal) && numVal === worst && selectedVehicles.length > 1 && best !== worst;
                                                const formatted = spec.format ? spec.format(raw) : String(raw);
                                                return (
                                                    <td key={v.id + i} className="p-3 text-center">
                                                        <span className={`text-sm font-medium tabular-nums ${isBest ? 'text-green-400 font-bold' : isWorst ? 'text-red-400/70' : 'text-white'
                                                            }`}>
                                                            {formatted}
                                                            {isBest && ' ✓'}
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                                {/* Equipment row */}
                                <tr className="border-t border-white/5">
                                    <td className="sticky left-0 bg-brand-dark z-10 p-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Zap size={14} />
                                            Équipements
                                        </div>
                                    </td>
                                    {selectedVehicles.map((v, i) => (
                                        <td key={v.id + i} className="p-3 align-top">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {v.equipements.map(eq => (
                                                    <span key={eq} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-slate-400">{eq}</span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* ── Consumer insight ── */}
                    <div className="glass-panel rounded-2xl p-6 mt-8 border-l-4 border-blue-500">
                        <h3 className="text-sm font-bold text-white font-display mb-2">💡 Conseil Doitz</h3>
                        <p className="text-sm text-slate-300">
                            Ne comparez pas que le prix neuf ! Le <strong className="text-green-400">prix occasion ~3 ans</strong> vous montre combien le véhicule a décôté.
                            Un véhicule qui décôte peu = un bon investissement. Un véhicule qui décôte beaucoup = profitez-en à l'achat occasion !
                        </p>
                        <p className="text-xs text-slate-500 mt-3">
                            ℹ️ <strong>Note :</strong> les scores de fiabilité sont des estimations basées sur les retours forums et les statistiques de pannes (ADAC, Que Choisir). Ils ne remplacent pas une inspection individuelle du véhicule.
                        </p>
                    </div>
                    {selectedVehicles.some(v => v.critair >= 2) && (
                        <div className="glass-panel rounded-2xl p-4 mt-4 border-l-4 border-amber-500">
                            <p className="text-xs text-amber-300">
                                ⚠️ <strong>ZFE :</strong> les véhicules Crit'Air 2+ sont progressivement interdits dans les métropoles (Paris, Lyon, Marseille…). Vérifiez la compatibilité ZFE avant d'acheter un diesel.
                            </p>
                        </div>
                    )}

                    {/* ── Links ── */}
                    <div className="flex flex-wrap gap-3 mt-6 justify-center">
                        <Link to="/outils/simulateur-financement" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                            → Simulateur financement
                        </Link>
                        <Link to="/outils/simulateur-cout-utilisation" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                            → Coût d'utilisation
                        </Link>
                        <Link to="/outils/simulateur-carburant" className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20">
                            → Comparaison carburant
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ComparateurVehicules;
