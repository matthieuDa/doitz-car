import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import BlogPostSSG from '@/pages/BlogPostSSG';
import OutilsIndex from '@/pages/outils/OutilsIndex';
import SimulateurFinancement from '@/pages/outils/SimulateurFinancement';
import SimulateurCarteGrise from '@/pages/outils/SimulateurCarteGrise';
import SimulateurCarburant from '@/pages/outils/SimulateurCarburant';
import SimulateurCoutUtilisation from '@/pages/outils/SimulateurCoutUtilisation';
import ComparateurVehicules from '@/pages/outils/ComparateurVehicules';
import CalculateurDecote from '@/pages/outils/CalculateurDecote';
import NotFound from '@/pages/NotFound';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import Background from '@/components/Background';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Allow any child component to open the form via a custom event
  useEffect(() => {
    const handler = () => setIsFormOpen(true);
    window.addEventListener('open-lead-form', handler);
    return () => window.removeEventListener('open-lead-form', handler);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
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
          <Header onOpenForm={() => setIsFormOpen(true)} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostSSG />} />
            <Route path="/outils" element={<OutilsIndex />} />
            <Route path="/outils/simulateur-financement" element={<SimulateurFinancement />} />
            <Route path="/outils/simulateur-carte-grise" element={<SimulateurCarteGrise />} />
            <Route path="/outils/simulateur-carburant" element={<SimulateurCarburant />} />
            <Route path="/outils/simulateur-cout-utilisation" element={<SimulateurCoutUtilisation />} />
            <Route path="/outils/comparateur-vehicules" element={<ComparateurVehicules />} />
            <Route path="/outils/calculateur-decote" element={<CalculateurDecote />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
          <LeadForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;