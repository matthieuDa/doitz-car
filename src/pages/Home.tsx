import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import SavingsCalculator from '@/components/SavingsCalculator';
import Process from '@/components/Process';
import GuideTeaser from '@/components/GuideTeaser';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import { SEO } from '@/components/layout/SEO';
import { generateLocalBusinessSchema, generateFAQSchema } from '@/utils/structuredData';

const Home: React.FC = () => {
    const openForm = () => window.dispatchEvent(new Event('open-lead-form'));

    const faqSchema = generateFAQSchema([
        { question: 'Quels sont les délais moyens pour une importation ?', answer: 'En général, comptez entre 3 et 4 semaines pour une importation depuis l\'Union Européenne.' },
        { question: 'La garantie constructeur est-elle valable en France ?', answer: 'La garantie constructeur européenne est valable dans tous les pays membres de l\'UE.' },
        { question: 'Comment fonctionne la TVA sur un véhicule importé ?', answer: 'Pour un véhicule d\'occasion (+6 mois et +6 000 km), vous ne payez pas la TVA en France.' },
        { question: 'Le malus écologique est-il à payer ?', answer: 'Oui, le malus écologique est dû lors de la première immatriculation en France, réduit de 10% par année d\'ancienneté.' },
    ]);

    return (
        <>
            <SEO
                title="Courtier Auto — Import Véhicules Europe"
                description="Courtier automobile spécialisé dans le sourcing de véhicules européens. Accompagnement de A à Z. Économisez jusqu'à 40% sur votre prochain véhicule."
                schema={[generateLocalBusinessSchema(), faqSchema]}
            />

            <main>
                <Hero onOpenForm={openForm} />
                <Features />
                <SavingsCalculator />
                <Process />
                <GuideTeaser />
                <Testimonials />
                <Pricing onOpenForm={openForm} />
                <FAQ />
            </main>
        </>
    );
};

export default Home;
