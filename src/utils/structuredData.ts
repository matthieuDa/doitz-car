import { SITE_URL } from './constants';

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: 'Doitz',
        alternateName: 'Doitz — Courtier Auto Europe',
        image: `${SITE_URL}/favicon.svg`,
        description: 'Courtier automobile spécialisé dans le sourcing de véhicules européens. Accompagnement personnalisé : définition du besoin, recherche, négociation et financement. Économisez jusqu\'à 40%.',
        telephone: '+33781727689',
        email: 'matthieu+doitz-auto@zennest.io',
        url: SITE_URL,
        priceRange: '€€-€€€€',
        knowsAbout: [
            'Courtage automobile', 'Import véhicules européens', 'Sourcing auto',
            'Mandataire auto', 'Financement automobile', 'Homologation',
            'Négociation véhicule', 'Cahier des charges auto'
        ],
        areaServed: { '@type': 'Country', name: 'France' },
        sameAs: ['https://www.instagram.com/doitz/'],
        makesOffer: {
            '@type': 'Offer',
            itemOffered: {
                '@type': 'Service',
                name: 'Courtage automobile européen',
                description: 'Accompagnement complet : définition du besoin, recherche véhicule, négociation, logistique et financement.'
            }
        }
    };
}

export function generateArticleSchema(
    title: string,
    description: string,
    slug: string,
    datePublished: string,
    image?: string,
    author: string = 'Équipe Doitz',
    wordCount?: number,
    keywords?: string[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: image || `${SITE_URL}/images/blog/${slug}.jpg`,
        datePublished,
        dateModified: datePublished,
        author: {
            '@type': 'Organization',
            name: author,
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` }
        },
        url: `${SITE_URL}/blog/${slug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${slug}`
        },
        publisher: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Doitz',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` }
        },
        inLanguage: 'fr-FR',
        ...(wordCount && { wordCount }),
        ...(keywords && keywords.length > 0 && { keywords: keywords.join(', ') }),
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['article h1', 'article h2', 'article p:first-of-type']
        }
    };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(item => ({
            '@type': 'Question', name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };
}

export function generateHowToSchema(
    name: string,
    description: string,
    steps: Array<{ name: string; text: string }>,
    totalTime?: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        ...(totalTime && { totalTime }),
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
        })),
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateWebApplicationSchema(
    name: string,
    description: string,
    url: string,
    keywords?: string[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
        },
        creator: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Doitz',
        },
        inLanguage: 'fr-FR',
        ...(keywords && keywords.length > 0 && { keywords: keywords.join(', ') }),
    };
}
