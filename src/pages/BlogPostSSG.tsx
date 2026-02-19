import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import ReadingProgress from '@/components/blog/ReadingProgress';
import TableOfContents from '@/components/blog/TableOfContents';
import ArticleContent from '@/components/blog/ArticleContent';
import BlogCard from '@/components/blog/BlogCard';
import CTASidebar from '@/components/blog/CTASidebar';
import { SEO } from '@/components/layout/SEO';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/utils/structuredData';
import { parseFrontmatter, extractHeadings, extractFAQs, countWords, renderMarkdown } from '@/utils/markdownRenderer';
import { getSimilarPosts } from '@/utils/blogSuggestions';
import { SITE_URL, PHONE, PHONE_DISPLAY, WHATSAPP_URL } from '@/utils/constants';
import blogMetadata from '@/data/blog-metadata.json';

// Import all markdown files at build time
const markdownModules = import.meta.glob('/src/posts/articles/*.md', { as: 'raw', eager: true });

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

const BlogPostSSG: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const openForm = () => window.dispatchEvent(new Event('open-lead-form'));

    // Find the markdown module for this slug
    const markdownRaw = useMemo(() => {
        const key = `/src/posts/articles/${slug}.md`;
        return markdownModules[key] as string | undefined;
    }, [slug]);

    // Parse the markdown
    const { frontmatter, content, html, headings, faqs, wordCount } = useMemo(() => {
        if (!markdownRaw) return { frontmatter: {} as any, content: '', html: '', headings: [], faqs: [], wordCount: 0 };
        const parsed = parseFrontmatter(markdownRaw);
        const headings = extractHeadings(parsed.content);
        const faqs = extractFAQs(parsed.content);
        const wc = countWords(parsed.content);
        const html = renderMarkdown(parsed.content);
        return { frontmatter: parsed.frontmatter, content: parsed.content, html, headings, faqs, wordCount: wc };
    }, [markdownRaw]);

    // Get similar posts
    const similarPosts = useMemo(() => {
        return getSimilarPosts(slug || '', frontmatter.category?.toLowerCase() || '', blogMetadata as any);
    }, [slug, frontmatter.category]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!markdownRaw) {
        return (
            <>

                <div className="min-h-screen flex items-center justify-center pt-24">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Article non trouvé</h1>
                        <p className="text-slate-400 mb-8">L'article que vous cherchez n'existe pas.</p>
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all"
                        >
                            <ArrowLeft size={16} />
                            Retour au blog
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const colorClass = categoryColors[frontmatter.category?.toLowerCase()] || 'bg-slate-500/20 text-slate-300';
    const categoryLabel = categoryLabels[frontmatter.category?.toLowerCase()] || frontmatter.category;
    const keywords: string[] = frontmatter.keywords || [];

    const breadcrumbs = generateBreadcrumbSchema([
        { name: 'Accueil', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: frontmatter.title || '', url: `${SITE_URL}/blog/${slug}` },
    ]);

    const articleSchema = generateArticleSchema(
        frontmatter.title || '',
        frontmatter.excerpt || '',
        slug || '',
        frontmatter.publishedAt || '',
        frontmatter.image,
        'Équipe Doitz',
        wordCount,
        keywords
    );

    // Build schemas array: article + FAQ (if any)
    const schemas: object[] = [articleSchema];
    if (faqs.length > 0) {
        schemas.push(generateFAQSchema(faqs));
    }

    return (
        <>
            <SEO
                title={frontmatter.title}
                description={frontmatter.excerpt}
                canonical={`${SITE_URL}/blog/${slug}`}
                type="article"
                image={frontmatter.image}
                schema={schemas}
                breadcrumbs={breadcrumbs}
                keywords={keywords}
                author="Équipe Doitz"
                publishedTime={frontmatter.publishedAt}
                section={categoryLabel}
                tags={keywords}
            />

            <ReadingProgress />


            <main className="min-h-screen pt-24">
                {/* Hero */}
                <section className="py-12 md:py-16 relative overflow-hidden">
                    <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                <Link to="/" className="hover:text-slate-300 transition-colors">Accueil</Link>
                                <span>/</span>
                                <Link to="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
                                <span>/</span>
                                <span className="text-slate-400 truncate max-w-[200px]">{frontmatter.title}</span>
                            </nav>

                            <div className="flex items-center gap-3 mb-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                                    {categoryLabel}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-slate-500">
                                    <Clock size={14} />
                                    {frontmatter.readTime}
                                </span>
                                <span className="text-sm text-slate-500">· {frontmatter.publishedAt}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight max-w-4xl">
                                {frontmatter.title}
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Article Body */}
                <section className="pb-20">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_260px] gap-8 max-w-7xl mx-auto">
                            {/* Table of Contents - Desktop */}
                            <div className="hidden xl:block">
                                <TableOfContents headings={headings} />
                            </div>

                            {/* Article Content */}
                            <div className="min-w-0">
                                <ArticleContent html={html} />

                                {/* Mobile CTA */}
                                <div className="lg:hidden mt-12 space-y-4">
                                    <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 p-6 text-center">
                                        <h4 className="text-lg font-bold text-white font-display mb-2">Un projet auto ?</h4>
                                        <p className="text-sm text-slate-400 mb-4">Décrivez-nous votre besoin, on s'occupe du reste.</p>
                                        <button
                                            onClick={openForm}
                                            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            Consultation gratuite
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                    <div className="flex gap-3">
                                        <a
                                            href={`tel:${PHONE}`}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 py-3 text-sm font-medium text-white hover:bg-white/[0.06] transition-all"
                                        >
                                            <Phone size={16} className="text-green-400" />
                                            Appeler
                                        </a>
                                        <a
                                            href={WHATSAPP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 py-3 text-sm font-medium text-white hover:bg-white/[0.06] transition-all"
                                        >
                                            <MessageCircle size={16} className="text-green-400" />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Sidebar - Desktop */}
                            <CTASidebar onOpenForm={openForm} />
                        </div>
                    </div>
                </section>

                {/* Similar Articles */}
                {similarPosts.length > 0 && (
                    <section className="py-16 border-t border-white/5">
                        <div className="container mx-auto px-6">
                            <h2 className="text-2xl font-bold text-white font-display mb-8">Articles similaires</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {similarPosts.map((post, idx) => (
                                    <BlogCard
                                        key={post.slug}
                                        slug={post.slug}
                                        title={post.title}
                                        excerpt={post.excerpt}
                                        category={post.category?.toLowerCase()}
                                        readTime={post.readTime}
                                        image={post.image}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>


        </>
    );
};

export default BlogPostSSG;
