import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, HelpCircle, Car, Loader2 } from 'lucide-react';
import type { FormData, FormStep } from '../types';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose }) => {
  const formName = 'doitz-lead';
  const [step, setStep] = useState<FormStep>('INTENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    intent: null,
    budget: '',
    carType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 'INTENT') setStep('CRITERIA');
    else if (step === 'CRITERIA') setStep('CONTACT');
  };

  const handleBack = () => {
    if (step === 'CRITERIA') setStep('INTENT');
    else if (step === 'CONTACT') setStep('CRITERIA');
  };

  const encode = (data: Record<string, any>) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': formName, ...formData }),
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur est survenue. Merci de réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-4 right-4 z-20">
             <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <X size={24} />
            </button>
        </div>

        {isSuccess ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]"
            >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 font-display">Demande envoyée !</h3>
                <p className="text-slate-300 text-lg mb-8 max-w-md">
                    Merci {formData.firstName}. Nous avons bien reçu votre projet.
                    <br/><br/>
                    <span className="text-white font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/5">Un expert DOITZ vous recontactera sous 48h.</span>
                </p>
                <button onClick={onClose} className="bg-brand-accent text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors">
                    Fermer
                </button>
            </motion.div>
        ) : (
            <>
                <div className="p-8 border-b border-white/10 bg-[#0F172A]">
                    <h3 className="text-2xl font-bold text-white mb-4 font-display">Trouver ma voiture</h3>
                    <div className="flex gap-2">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === 'INTENT' || step === 'CRITERIA' || step === 'CONTACT' ? 'bg-brand-accent' : 'bg-slate-800'}`} />
                        <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === 'CRITERIA' || step === 'CONTACT' ? 'bg-brand-accent' : 'bg-slate-800'}`} />
                        <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === 'CONTACT' ? 'bg-brand-accent' : 'bg-slate-800'}`} />
                    </div>
                </div>

                <form
                  name={formName}
                  method="POST"
                  netlify
                  data-netlify="true"
                  onSubmit={handleSubmit}
                  className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#0F172A] to-[#020617]"
                >
                <input type="hidden" name="form-name" value={formName} />
                <input type="hidden" name="intent" value={formData.intent ?? ''} />
                {step !== 'CRITERIA' && (
                  <>
                    <input type="hidden" name="budget" value={formData.budget} />
                    <input type="hidden" name="carType" value={formData.carType} />
                  </>
                )}
                <AnimatePresence mode="wait">
                    {step === 'INTENT' && (
                    <motion.div 
                        key="intent"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h4 className="text-xl font-medium text-slate-300 mb-6">Où en êtes-vous dans votre projet ?</h4>
                        
                        <button 
                        type="button"
                        onClick={() => {
                            setFormData({...formData, intent: 'SPECIFIC'});
                            handleNext();
                        }}
                        className="w-full p-6 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-brand-accent/10 hover:border-brand-accent transition-all text-left flex items-start gap-4 group"
                        >
                        <div className="p-3 bg-brand-accent/20 rounded-lg text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-colors">
                            <Car size={28} />
                        </div>
                        <div>
                            <h5 className="text-lg font-bold text-white group-hover:text-brand-accent">Je sais ce que je veux</h5>
                            <p className="text-slate-400 text-sm mt-1">J'ai un modèle précis en tête (marque, modèle, options).</p>
                        </div>
                        </button>

                        <button 
                        type="button"
                        onClick={() => {
                            setFormData({...formData, intent: 'ADVICE'});
                            handleNext();
                        }}
                        className="w-full p-6 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-brand-gold/10 hover:border-brand-gold transition-all text-left flex items-start gap-4 group"
                        >
                        <div className="p-3 bg-brand-gold/20 rounded-lg text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors">
                            <HelpCircle size={28} />
                        </div>
                        <div>
                            <h5 className="text-lg font-bold text-white group-hover:text-brand-gold">J'ai besoin de conseils</h5>
                            <p className="text-slate-400 text-sm mt-1">Je cherche un type de véhicule, aidez-moi à trouver le meilleur.</p>
                        </div>
                        </button>
                    </motion.div>
                    )}

                    {step === 'CRITERIA' && (
                    <motion.div 
                        key="criteria"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h4 className="text-xl font-medium text-slate-300 mb-6">Vos critères de recherche</h4>
                        
                        <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Budget approximatif (€)</label>
                            <input 
                            type="text" 
                            name="budget"
                            placeholder="Ex: 30 000 - 40 000"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                {formData.intent === 'SPECIFIC' ? 'Modèle recherché' : 'Type de véhicule souhaité'}
                            </label>
                            <textarea 
                            name="carType"
                            placeholder={formData.intent === 'SPECIFIC' ? "Ex: Audi A3 Sportback, 2020+, S-Line, Toit ouvrant..." : "Ex: SUV familial, Hybride, Coffre spacieux..."}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all h-32 resize-none"
                            value={formData.carType}
                            onChange={(e) => setFormData({...formData, carType: e.target.value})}
                            />
                        </div>
                        </div>

                        <div className="flex gap-4 pt-8">
                        <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                            <ArrowLeft size={18} /> Retour
                        </button>
                        <button type="button" onClick={handleNext} className="flex-1 bg-white text-brand-dark font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                            Suivant <ArrowRight size={18} />
                        </button>
                        </div>
                    </motion.div>
                    )}

                    {step === 'CONTACT' && (
                    <motion.div 
                        key="contact"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h4 className="text-xl font-medium text-slate-300 mb-6">Dernière étape</h4>
                        <p className="text-slate-400 mb-6 text-sm">Laissez-nous vos coordonnées pour recevoir votre sélection personnalisée.</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Prénom</label>
                                    <input 
                                    required
                                    type="text" 
                                    name="firstName"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Nom</label>
                                    <input 
                                    required
                                    type="text" 
                                    name="lastName"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                            </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input 
                            required
                            type="email" 
                            name="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Téléphone</label>
                            <input 
                            required
                            type="tel" 
                            name="phone"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        {errorMessage && (
                          <p className="text-red-400 text-sm">{errorMessage}</p>
                        )}

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                                <ArrowLeft size={18} /> Retour
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 bg-brand-accent text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Envoyer ma demande <CheckCircle2 size={18} /></>}
                            </button>
                        </div>
                    </motion.div>
                    )}

                </AnimatePresence>
                </form>
            </>
        )}
      </motion.div>
    </div>
  );
};

export default LeadForm;
