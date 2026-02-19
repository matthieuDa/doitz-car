import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import LeadForm from '@/components/LeadForm';
import BlogCard from '@/components/blog/BlogCard';
import { SEO } from '@/components/layout/SEO';
import { generateBreadcrumbSchema } from '@/utils/structuredData';
import { SITE_URL, BLOG_CATEGORIES } from '@/utils/constants';
import blogMetadata from '@/data/blog-metadata.json';

const ARTICLES_PER_PAGE = 12;

const Blog: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'all') return blogMetadata;
        return blogMetadata.filter((post: any) =>
            post.category?.toLowerCase() === activeCategory
        );
    }, [activeCategory]);

    const totalPages = Math.ceil(filteredPosts.length / ARTICLES_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * ARTICLES_PER_PAGE,
        currentPage * ARTICLES_PER_PAGE
    );

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Accueil', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
    ]);

    return (
        <>
            <SEO
                title="Blog Auto — Guides Import & Conseils"
                description="Guides complets sur l'import automobile en Europe. Démarches, fiscalité, comparatifs de prix, conseils d'experts. Économisez jusqu'à 40% sur votre véhicule."
                canonical={`${SITE_URL}/blog`}
                breadcrumbs={breadcrumbs}
            />

            <Header onOpenForm={() => setIsFormOpen(true)} />

            <main className="min-h-screen pt-24">
                {/* Hero */}
                <section className="py-16 md:py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <span className="text-brand-accent font-bold tracking-widest text-xs uppercase mb-4 block">
                                Blog Doitz
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6 leading-tight">
                                Guides Import, Conseils{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    & Bonnes Affaires
                                </span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                Tout savoir pour acheter votre véhicule au meilleur prix en Europe.
                                Guides pratiques, comparatifs, et conseils d'experts.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Category Filters */}
                <section className="border-y border-white/5 bg-white/[0.01]">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                            {BLOG_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 border border-white/5'
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Articles Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        {paginatedPosts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-500 text-lg">Aucun article dans cette catégorie pour le moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedPosts.map((post: any, idx: number) => (
                                    <BlogCard
                                        key={post.slug}
                                        slug={post.slug}
                                        title={post.title}
                                        excerpt={post.excerpt}
                                        category={post.category?.toLowerCase()}
                                        readTime={post.readTime}
                                        image={post.image}
                                        publishedAt={post.publishedAt}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === page
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] border border-white/5'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-16 border-t border-white/5">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-900/10 border border-blue-500/15 p-8">
                            <h2 className="text-2xl font-bold text-white font-display mb-3">
                                Besoin d'un accompagnement personnalisé ?
                            </h2>
                            <p className="text-slate-400 mb-6 text-sm">
                                Décrivez-nous votre projet auto. Consultation gratuite et sans engagement.
                            </p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
                            >
                                <span>Consultation gratuite</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <LeadForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </>
    );
};

export default Blog;
