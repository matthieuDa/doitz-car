import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenForm }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-brand-dark/80 backdrop-blur-lg border-b border-white/5 shadow-lg' : 'py-6 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="font-display font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white">DOITZ<span className="text-brand-accent">.</span></span>
        </Link>

        {/* Desktop Nav — same on every page */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/blog')
              ? 'text-blue-400'
              : 'text-slate-300 hover:text-white'
              }`}
          >
            Blog
          </Link>
          <Link
            to="/outils"
            className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/outils')
              ? 'text-blue-400'
              : 'text-slate-300 hover:text-white'
              }`}
          >
            Outils
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={onOpenForm}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transform hover:-translate-y-0.5"
          >
            Devis gratuit
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <Link
                to="/blog"
                className="text-lg font-medium text-brand-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/outils"
                className="text-lg font-medium text-brand-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Outils
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenForm();
                }}
                className="w-full py-3 rounded-xl bg-brand-accent text-white font-semibold shadow-lg shadow-blue-900/50"
              >
                Trouver ma voiture
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;