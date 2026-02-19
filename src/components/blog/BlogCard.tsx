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
    comparatif: 'bg-purple-500/20 text-purple-300',
    occasion: 'bg-rose-500/20 text-rose-300',
    financement: 'bg-cyan-500/20 text-cyan-300',
};

const categoryLabels: Record<string, string> = {
    import: 'Import',
    accompagnement: 'Accompagnement',
    fiscalite: 'Fiscalité',
    comparatif: 'Comparatifs',
    occasion: 'Occasion',
    financement: 'Financement',
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
    const colorClass = categoryColors[category] || 'bg-slate-500/20 text-slate-300';
    const label = categoryLabels[category] || category;

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
                {/* Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl opacity-20">🚗</div>
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
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
