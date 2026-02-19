import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SavingsCalculator from './components/SavingsCalculator';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import GuideTeaser from './components/GuideTeaser';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LeadForm from './components/LeadForm';
import Background from './components/Background';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <div className="min-h-screen relative z-10">
      <Background />
      <Header onOpenForm={openForm} />
      
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

      <Footer />
      
      <LeadForm isOpen={isFormOpen} onClose={closeForm} />
    </div>
  );
}

export default App;