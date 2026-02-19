import React from 'react';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { PHONE, PHONE_DISPLAY, WHATSAPP_URL } from '@/utils/constants';

interface CTASidebarProps {
    onOpenForm?: () => void;
}

const CTASidebar: React.FC<CTASidebarProps> = ({ onOpenForm }) => {
    return (
        <div className="sticky top-28 space-y-4 hidden lg:block">
            {/* Main CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 p-6">
                <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                        <span className="text-2xl">🚗</span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-display">
                        Un projet auto ?
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                        Décrivez-nous votre besoin, on s'occupe du reste.
                    </p>
                </div>

                <button
                    onClick={onOpenForm}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 group"
                >
                    <span>Décrivez votre projet</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Phone */}
            <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:border-white/15 hover:bg-white/[0.05] transition-all group"
            >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-colors">
                    <Phone size={18} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-medium">Appelez-nous</p>
                    <p className="text-sm font-semibold text-white">{PHONE_DISPLAY}</p>
                </div>
            </a>

            {/* WhatsApp */}
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:border-green-500/20 hover:bg-green-900/10 transition-all group"
            >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle size={18} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-medium">WhatsApp</p>
                    <p className="text-sm font-semibold text-white">Écrivez-nous</p>
                </div>
            </a>

            {/* Trust */}
            <div className="text-center pt-2">
                <p className="text-[11px] text-slate-600">
                    Consultation gratuite · Sans engagement
                </p>
            </div>
        </div>
    );
};

export default CTASidebar;
