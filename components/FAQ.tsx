import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Quels sont les délais moyens pour une importation ?",
      answer: "En général, comptez entre 3 et 4 semaines pour une importation depuis l'Union Européenne (Allemagne, Italie, Luxembourg). Cela inclut la recherche, la négociation, l'inspection, le rapatriement et les démarches administratives initiales (Quitus, CPI WW)."
    },
    {
      question: "La garantie constructeur est-elle valable en France ?",
      answer: "Absolument. La garantie constructeur européenne est valable dans tous les pays membres de l'UE. Si vous achetez une voiture sous garantie en Allemagne, elle sera prise en charge par les concessionnaires français de la marque sans distinction."
    },
    {
      question: "Comment fonctionne la TVA sur un véhicule importé ?",
      answer: "Pour un véhicule d'occasion (+6 mois et +6 000 km), vous ne payez pas la TVA en France. Vous la payez dans le pays d'achat (incluse dans le prix TTC). Si le véhicule est neuf (-6 mois ou -6 000 km), vous achetez HT à l'étranger et payez la TVA (20%) en France."
    },
    {
      question: "Que se passe-t-il si le véhicule a un défaut non signalé ?",
      answer: "Nous sécurisons l'achat avec une inspection physique ou un rapport DEKRA indépendant avant tout paiement. De plus, en achetant à des professionnels agréés, vous bénéficiez de la garantie légale de conformité. Nous vérifions scrupuleusement l'historique pour éviter les mauvaises surprises."
    },
    {
      question: "Le malus écologique est-il à payer ?",
      answer: "Oui, le malus écologique est dû lors de la première immatriculation en France. Cependant, pour un véhicule d'occasion, il est réduit de 10% par année d'ancienneté depuis sa première mise en circulation. Nous intégrons ce calcul dans notre estimation de coût total."
    }
  ];

  return (
    <section className="py-32 bg-brand-dark border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Header */}
          <div className="md:w-1/3">
            <span className="text-brand-accent font-bold tracking-widest text-xs uppercase mb-4 block">Questions fréquentes</span>
            <h2 className="text-4xl font-bold text-white mb-6 font-display">Tout ce que vous devez savoir</h2>
            <p className="text-slate-400 mb-8 text-lg">
              L'importation peut sembler complexe, mais c'est notre métier de la rendre simple. 
              Vous ne trouvez pas votre réponse ?
            </p>
            <a href="mailto:matthieu+doitz-auto@zennest.io" className="text-brand-accent font-semibold hover:text-white transition-colors border-b border-brand-accent/30 pb-1 inline-flex items-center gap-2">
              Contactez-nous directement
            </a>
          </div>

          {/* Accordion */}
          <div className="md:w-2/3">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden transition-colors ${activeIndex === index ? 'bg-white/[0.05] border-white/10' : 'hover:bg-white/[0.04]'}`}
                >
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className={`text-lg font-medium transition-colors ${activeIndex === index ? 'text-white' : 'text-slate-300'}`}>
                      {faq.question}
                    </span>
                    <span className={`ml-4 p-2 rounded-full transition-all ${activeIndex === index ? 'bg-brand-accent text-white rotate-180' : 'bg-white/5 text-slate-400'}`}>
                        {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;