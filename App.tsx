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
      {/* Hidden Netlify form to enable build-time detection */}
      <form
        name="doitz-lead"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        <input type="hidden" name="form-name" value="doitz-lead" />
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <input type="email" name="email" />
        <input type="tel" name="phone" />
        <input type="text" name="budget" />
        <textarea name="carType" />
        <input type="text" name="intent" />
        <input type="text" name="bot-field" />
      </form>
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