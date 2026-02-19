import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    image?: string;
    publishedAt?: string;
    index?: number;
}

const categoryColors: Record<string, string> = {
    import: 'bg-blue-500/20 text-blue-300',
    accompagnement: 'bg-emerald-500/20 text-emerald-300',
    fiscalite: 'bg-amber-500/20 text-amber-300',
    'fiscalité': 'bg-amber-500/20 text-amber-300',
    comparatif: 'bg-purple-500/20 text-purple-300',
    occasion: 'bg-rose-500/20 text-rose-300',
    financement: 'bg-cyan-500/20 text-cyan-300',
    'électrique': 'bg-teal-500/20 text-teal-300',
    electrique: 'bg-teal-500/20 text-teal-300',
    utilitaire: 'bg-slate-500/20 text-slate-300',
    'achat & vente': 'bg-indigo-500/20 text-indigo-300',
    'réglementation': 'bg-orange-500/20 text-orange-300',
};

const categoryLabels: Record<string, string> = {
    import: 'Import',
    accompagnement: 'Accompagnement',
    fiscalite: 'Fiscalité',
    'fiscalité': 'Fiscalité',
    comparatif: 'Comparatifs',
    occasion: 'Occasion',
    financement: 'Financement',
    'électrique': 'Électrique',
    electrique: 'Électrique',
    utilitaire: 'Utilitaire',
    'achat & vente': 'Achat & Vente',
    'réglementation': 'Réglementation',
};

/* Category-based gradient backgrounds for cards without images */
const categoryGradients: Record<string, string> = {
    import: 'from-blue-600/30 via-cyan-600/20 to-blue-900/40',
    accompagnement: 'from-emerald-600/30 via-green-600/20 to-emerald-900/40',
    fiscalite: 'from-amber-600/30 via-orange-600/20 to-amber-900/40',
    'fiscalité': 'from-amber-600/30 via-orange-600/20 to-amber-900/40',
    comparatif: 'from-purple-600/30 via-violet-600/20 to-purple-900/40',
    occasion: 'from-rose-600/30 via-pink-600/20 to-rose-900/40',
    financement: 'from-cyan-600/30 via-blue-600/20 to-cyan-900/40',
    'électrique': 'from-teal-600/30 via-cyan-600/20 to-teal-900/40',
    electrique: 'from-teal-600/30 via-cyan-600/20 to-teal-900/40',
    utilitaire: 'from-slate-600/30 via-gray-600/20 to-slate-900/40',
    'achat & vente': 'from-indigo-600/30 via-blue-600/20 to-indigo-900/40',
    'réglementation': 'from-orange-600/30 via-amber-600/20 to-orange-900/40',
};

const categoryIcons: Record<string, string> = {
    import: '🌍',
    accompagnement: '🤝',
    fiscalite: '📋',
    'fiscalité': '📋',
    comparatif: '⚖️',
    occasion: '🔑',
    financement: '💰',
    'électrique': '⚡',
    electrique: '⚡',
    utilitaire: '🚚',
    'achat & vente': '🏷️',
    'réglementation': '📜',
};

const BlogCard: React.FC<BlogCardProps> = ({
    slug,
    title,
    excerpt,
    category,
    readTime,
    image,
    publishedAt,
    index = 0,
}) => {
    const catKey = category?.toLowerCase() || '';
    const colorClass = categoryColors[catKey] || 'bg-slate-500/20 text-slate-300';
    const label = categoryLabels[catKey] || category;
    const gradient = categoryGradients[catKey] || 'from-slate-600/30 via-slate-700/20 to-slate-900/40';
    const icon = categoryIcons[catKey] || '🚗';

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link
                to={`/blog/${slug}`}
                className="group block h-full rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300"
            >
                {/* Image / Category Gradient */}
                <div className="aspect-[16/9] overflow-hidden relative">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                            {/* Decorative pattern */}
                            <div className="absolute inset-0 opacity-[0.04]"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                    backgroundSize: '24px 24px',
                                }} />
                            {/* Icon */}
                            <span className="text-5xl drop-shadow-lg relative z-10 opacity-80 group-hover:scale-110 transition-transform duration-300">
                                {icon}
                            </span>
                        </div>
                    )}
                    <div className="absolute top-3 left-3 z-10">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${colorClass}`}>
                            {label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        {publishedAt && <span>{publishedAt}</span>}
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {readTime}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 font-display">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                        {excerpt}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                        Lire l'article
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </Link>
        </motion.article>
    );
};

export default BlogCard;
