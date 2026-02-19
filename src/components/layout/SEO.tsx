import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '@/utils/constants';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
    schema?: object | object[];
    breadcrumbs?: object;
    noindex?: boolean;
    keywords?: string[];
    author?: string;
    publishedTime?: string;
    section?: string;
    tags?: string[];
}

/**
 * Component to inject JSON-LD directly into the DOM.
 * react-helmet-async has issues with <script> tags in React 19,
 * so we inject them directly via a portal-like approach.
 */
const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    type = 'website',
    image,
    schema,
    breadcrumbs,
    noindex = false,
    keywords,
    author = 'Équipe Doitz',
    publishedTime,
    section,
    tags,
}) => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = canonical || `${SITE_URL}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
    const ogImage = image || `${SITE_URL}/og-image.svg`;

    // Combine all schemas into array for injection
    const allSchemas: object[] = [];
    if (breadcrumbs) allSchemas.push(breadcrumbs);
    if (schema) {
        if (Array.isArray(schema)) {
            allSchemas.push(...schema);
        } else {
            allSchemas.push(schema);
        }
    }

    return (
        <>
            <Helmet>
                <title>{fullTitle}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                {noindex && <meta name="robots" content="noindex, nofollow" />}

                {/* Author & Keywords */}
                <meta name="author" content={author} />
                {keywords && keywords.length > 0 && (
                    <meta name="keywords" content={keywords.join(', ')} />
                )}

                {/* Open Graph */}
                <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="fr_FR" />
                <meta property="og:site_name" content={SITE_NAME} />

                {/* Article-specific OG tags */}
                {type === 'article' && publishedTime && (
                    <meta property="article:published_time" content={publishedTime} />
                )}
                {type === 'article' && section && (
                    <meta property="article:section" content={section} />
                )}
                {type === 'article' && tags && tags.map((tag, i) => (
                    <meta key={i} property="article:tag" content={tag} />
                ))}
                {type === 'article' && (
                    <meta property="article:author" content={author} />
                )}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
            </Helmet>

            {/* JSON-LD Schemas — rendered directly to bypass react-helmet-async script tag issues */}
            {allSchemas.map((s, i) => (
                <JsonLd key={i} data={s} />
            ))}
        </>
    );
};

export default SEO;
