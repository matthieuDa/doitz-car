# 🚗 Architecture Doitz — Guide Complet SEO & Blog

## Courtier en Véhicules Européens pour la France

**Positionnement** : Doitz est un **courtier automobile** qui accompagne les foyers français et entrepreneurs dans leur changement de véhicule. Nous intervenons de A à Z : définition du besoin, recherche du véhicule adapté au cahier des charges, sourcing de la meilleure affaire sur le marché européen, et financement si nécessaire.

**Objectif** : Transformer le site one-page Doitz en machine d'acquisition SEO avec un blog à fort taux de conversion, en s'appuyant sur les meilleures pratiques du site BKS.

**Audience cible** :

- 🏠 Foyers français cherchant à changer de véhicule (économie + sécurité)
- 💼 Entrepreneurs / TPE-PME cherchant des véhicules pros ou de fonction

**Audience document** : Antigravity AI Agent + Développeur  
**Dernière mise à jour** : 15 février 2026

---

## Table des Matières

1. [Phase 1 — Infrastructure Serveur & Projet](#phase-1--infrastructure-serveur--projet)
2. [Phase 2 — Fichiers SEO Techniques](#phase-2--fichiers-seo-techniques)
3. [Phase 3 — Structured Data (JSON-LD)](#phase-3--structured-data-json-ld)
4. [Phase 4 — Composant SEO Universel](#phase-4--composant-seo-universel)
5. [Phase 5 — Système de Blog Complet](#phase-5--système-de-blog-complet)
6. [Phase 6 — Page d'Accueil Blog](#phase-6--page-daccueil-blog)
7. [Phase 7 — Page Article Blog (blog.tsx)](#phase-7--page-article-blog-blogtsx)
8. [Phase 8 — Configuration SEO Centralisée](#phase-8--configuration-seo-centralisée)
9. [Phase 9 — Règles de Rédaction d'Articles](#phase-9--règles-de-rédaction-darticles)
10. [Phase 10 — Stratégie de Contenu & Mots-Clés](#phase-10--stratégie-de-contenu--mots-clés)
11. [Phase 11 — Optimisation Performance & Conversion](#phase-11--optimisation-performance--conversion)
12. [Phase 12 — Déploiement & Monitoring](#phase-12--déploiement--monitoring)
13. [Checklist Finale](#checklist-finale)

---

## Phase 1 — Infrastructure Serveur & Projet

### 1.1 Stack Technique (identique BKS)

```bash
# Créer le projet Vite + React + TypeScript
npm create vite@latest . -- --template react-ts
npm install
```

**Dépendances production** :

```bash
npm install react@18 react-dom@18 react-router-dom@6 react-helmet-async@2 \
  framer-motion lucide-react marked \
  @cloudinary/react @cloudinary/url-gen
```

**Dépendances dev** :

```bash
npm install -D @vitejs/plugin-react vite-react-ssg vite-plugin-pwa \
  terser typescript @types/react @types/react-dom @types/node ts-node
```

### 1.2 Structure de Dossiers

```
doitz-web/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml          (généré au build)
│   ├── favicon.ico
│   ├── favicon-48x48.png
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── site.webmanifest
│   ├── images/
│   │   ├── hero/
│   │   ├── blog/
│   │   └── og-image.jpg     (1200x630px)
│   ├── fonts/                (self-hosted)
│   └── admin/                (Decap CMS)
│       ├── index.html
│       └── config.yml
├── scripts/
│   ├── generate-blog-metadata.js
│   └── generate-sitemap.js
├── src/
│   ├── main.tsx              (entry SSG)
│   ├── App.tsx
│   ├── routes.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SEO.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SchemaMarkup.tsx
│   │   ├── blog/
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── ReadingProgress.tsx
│   │   │   └── TableOfContents.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Blog.tsx          (liste des articles)
│   │   ├── BlogPostSSG.tsx   (article individuel SSG)
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── posts/
│   │   └── articles/         (fichiers .md)
│   ├── data/
│   │   └── blog-metadata.json (généré)
│   ├── utils/
│   │   ├── seoConfig.ts
│   │   ├── structuredData.ts
│   │   ├── sitemap.ts
│   │   ├── markdownRenderer.ts
│   │   ├── blogSuggestions.ts
│   │   ├── cloudinary.ts
│   │   └── constants.ts
│   └── styles/
├── index.html
├── netlify.toml
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 1.3 Scripts package.json

```json
{
  "scripts": {
    "dev": "node scripts/generate-blog-metadata.js && vite",
    "build": "node scripts/generate-blog-metadata.js && node scripts/generate-sitemap.js && npx vite-react-ssg build",
    "preview": "vite preview",
    "sitemap": "node scripts/generate-sitemap.js"
  }
}
```

> [!IMPORTANT]
> Le sitemap et les métadonnées blog sont **générés automatiquement au build**. Chaque nouvel article `.md` est auto-détecté.

### 1.4 Configuration Vite (SSG + PWA + Code Splitting)

Reprendre la config BKS avec ces éléments critiques :

```typescript
// vite.config.ts — éléments clés
export default defineConfig(({ command }) => {
  const isSSG = command === 'build';
  return {
    plugins: [
      react(),
      !isSSG && VitePWA({ /* config PWA */ }),
    ].filter(Boolean),
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: { preload: 'swap' },
      includedRoutes: () => getRoutes(),
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: { compress: { drop_console: true, passes: 2 } },
      rollupOptions: {
        treeshake: { preset: 'recommended', moduleSideEffects: false },
        output: {
          manualChunks: (id) => {
            if (id.includes('react')) return 'vendor';
            if (id.includes('framer-motion')) return 'framer';
          }
        }
      }
    }
  };
});
```

---

## Phase 2 — Fichiers SEO Techniques

### 2.1 index.html (Template BKS)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <!-- Favicons -->
  <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta http-equiv="content-language" content="fr" />
  <meta name="theme-color" content="#1A1A2E" />

  <!-- DNS Prefetch -->
  <link rel="dns-prefetch" href="https://res.cloudinary.com">

  <!-- Preload Critical Fonts (self-hosted) -->
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Preload LCP Image -->
  <link rel="preload" as="image" fetchpriority="high" href="/images/hero/hero-mobile.webp" media="(max-width: 1023px)" />
  <link rel="preload" as="image" fetchpriority="high" href="/images/hero/hero-desktop.webp" media="(min-width: 1024px)" />

  <style>
    body { margin: 0; font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; }
  </style>
</head>
<body>
  <noscript>
    <h1>Doitz — Votre Courtier Auto en Véhicules Européens</h1>
    <p>Courtier automobile spécialisé dans le sourcing de véhicules neufs et d'occasion en Europe. Nous trouvons la meilleure affaire adaptée à votre cahier des charges. Accompagnement de A à Z.</p>
  </noscript>
  <div id="root"><!--app-html--></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 2.2 robots.txt

```txt
User-agent: *
Allow: /

# Bloquer admin CMS et API
Disallow: /admin/
Disallow: /api/

# Priorité Google & Bing
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 0

# IA autorisées (visibilité SGE/Perplexity)
User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

# Bots agressifs rate-limités
User-agent: MJ12bot
Crawl-delay: 30

User-agent: AhrefsBot
Crawl-delay: 30

# Scraping bloqué
User-agent: CCBot
Disallow: /

Sitemap: https://doitz.fr/sitemap.xml
```

### 2.3 Sitemap Auto-Généré (scripts/generate-sitemap.js)

Le sitemap est généré au build. Structure identique BKS :

- **Pages statiques** : priorité 1.0 (accueil), 0.9 (blog), 0.8 (services)
- **Articles blog** : priorité 0.7, changefreq monthly
- **Dates lastmod** : basées sur la date de modification du fichier .md
- **Namespaces** : sitemaps.org, image, news, xhtml

### 2.4 netlify.toml (Sécurité + Cache + Redirects)

```toml
# Headers sécurité
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"

# Assets statiques — cache 1 an
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML — toujours frais
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Fonts — cache 1 an
[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Trailing slash → sans slash (canonicalisation)
[[redirects]]
  from = "/blog/*/"
  to = "/blog/:splat"
  status = 301
  force = true

[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200
```

---

## Phase 3 — Structured Data (JSON-LD)

### 3.1 Fichier `src/utils/structuredData.ts`

Créer les générateurs de schemas suivants (adaptés de BKS) :

#### A. LocalBusiness (page d'accueil)

```typescript
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutoBroker', 'ProfessionalService'],
    '@id': 'https://doitz.fr/#organization',
    name: 'Doitz',
    alternateName: 'Doitz — Courtier Auto Europe',
    image: 'https://doitz.fr/images/logo.svg',
    description: 'Courtier automobile spécialisé dans le sourcing de véhicules européens. Accompagnement personnalisé : définition du besoin, recherche, négociation et financement. Économisez jusqu\'à 30%.',
    address: { '@type': 'PostalAddress', streetAddress: '[ADRESSE]', addressLocality: '[VILLE]', postalCode: '[CP]', addressCountry: 'FR' },
    geo: { '@type': 'GeoCoordinates', latitude: 0, longitude: 0 },
    telephone: '+33[NUMERO]',
    email: 'contact@doitz.fr',
    url: 'https://doitz.fr',
    priceRange: '€€-€€€€',
    knowsAbout: [
      'Courtage automobile', 'Import véhicules européens', 'Sourcing auto',
      'Mandataire auto', 'Financement automobile', 'Homologation',
      'Négociation véhicule', 'Cahier des charges auto'
    ],
    areaServed: { '@type': 'Country', name: 'France' },
    sameAs: ['https://www.instagram.com/doitz/', 'https://www.google.com/maps?cid=XXX'],
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }],
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
```

#### B. BlogPosting (chaque article)

```typescript
export function generateArticleSchema(title, description, slug, datePublished, author = 'Équipe Doitz') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: `https://doitz.fr/images/blog/${slug}.jpg`,
    datePublished,
    author: { '@type': 'Organization', name: author, url: 'https://doitz.fr' },
    url: `https://doitz.fr/blog/${slug}`,
    publisher: { '@type': 'Organization', '@id': 'https://doitz.fr/#organization', name: 'Doitz', logo: { '@type': 'ImageObject', url: 'https://doitz.fr/images/logo.svg' } },
  };
}
```

#### C. FAQPage (convertit en snippet dépliable sur Google)

```typescript
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
```

#### D. BreadcrumbList, HowTo, Product

Implémenter aussi `generateBreadcrumbSchema`, `generateHowToSchema` (pour guides étape par étape), et un nouveau `generateProductSchema` pour les fiches véhicules si applicable.

---

## Phase 4 — Composant SEO Universel

### `src/components/layout/SEO.tsx`

Composant réutilisable sur chaque page (identique BKS) :

```tsx
export const SEO: React.FC<SEOProps> = ({ title, description, canonical, type = 'website', image, schema, breadcrumbs }) => {
  const siteName = "Doitz";
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="fr_FR" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {/* JSON-LD Schemas */}
      {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Head>
  );
};
```

---

## Phase 5 — Système de Blog Complet

### 5.1 Articles en Markdown (Frontmatter)

Chaque article dans `src/posts/articles/` :

```markdown
---
title: "Import Véhicule Allemagne : Guide Complet 2026"
category: "Import"
type: "Guide"
readTime: "8 min"
image: "/images/blog/import-allemagne.jpg"
excerpt: "Économisez 20-30% en important votre véhicule d'Allemagne. Démarches, coûts, pièges à éviter. Guide complet."
publishedAt: "15 Février 2026"
featured: true
keywords: ["import voiture allemagne", "mandataire auto", "achat voiture europe"]
---

# Import d'un Véhicule depuis l'Allemagne : Guide Complet 2026

## Introduction
[Contenu...]
```

### 5.2 Routes SSG (`src/routes.ts`)

```typescript
import blogPostsData from './data/blog-metadata.json';

export const STATIC_ROUTES = ['/', '/blog', '/contact', '/mentions-legales', '/a-propos'];

export function getBlogRoutes(): string[] {
  return (blogPostsData as any[]).map(post => `/blog/${post.slug}`);
}

export function getRoutes(): string[] {
  return [...STATIC_ROUTES, ...getBlogRoutes()];
}
```

### 5.3 Composants Blog

- **`ReadingProgress.tsx`** : Barre de progression en haut de l'article
- **`TableOfContents.tsx`** : Table des matières sticky (desktop sidebar gauche)
- **`ArticleContent.tsx`** : Rendu HTML sécurisé du markdown

---

## Phase 6 — Page d'Accueil Blog (`Blog.tsx`)

### Éléments obligatoires

1. **SEO** : `<SEO title="Blog Auto — Guides Import & Conseils" description="..." schema={faqSchema} />`
2. **Hero section** avec titre H1 : "Blog Auto — Guides Import, Conseils & Bonnes Affaires"
3. **Filtres par catégorie** avec icônes (Import, Accompagnement, Fiscalité, Comparatifs, Occasion, Financement)
4. **Grille de cartes** responsive (1 col mobile, 2 col tablette, 3 col desktop)
5. **Chaque carte** : image lazy-loaded, catégorie badge, titre, excerpt, temps de lecture, lien "Lire l'article"
6. **Pagination** (12 articles par page)
7. **CTA discret** en bas : "Besoin d'un accompagnement personnalisé ? Consultation gratuite →"

---

## Phase 7 — Page Article Blog (`BlogPostSSG.tsx`)

### Architecture (identique BKS)

```
┌─────────────────────────────────────────────┐
│              HERO IMAGE + TITLE              │
│   ← Retour blog    [Catégorie] [8 min]      │
│   H1: Titre de l'article                    │
├──────────┬──────────────────┬────────────────┤
│ ToC      │   ARTICLE        │  CTA Sidebar   │
│ (sticky) │   (prose)        │  (sticky)      │
│          │                  │  • Devis       │
│          │   H2, H3...      │  • Téléphone   │
│          │   FAQ             │  • WhatsApp    │
│          │                  │                │
├──────────┴──────────────────┴────────────────┤
│           ARTICLES SIMILAIRES (3 cartes)      │
├──────────────────────────────────────────────┤
│           CTA MOBILE (visible lg:hidden)     │
└──────────────────────────────────────────────┘
```

### Éléments SEO critiques

- **`<SEO>`** avec title, description, image, type="article", schema ArticleSchema, breadcrumbs
- **Breadcrumbs** : Accueil > Blog > [Titre article]
- **Schema JSON-LD** : BlogPosting auto-généré
- **Articles similaires** : 3 articles de même catégorie (maillage interne)
- **CTA sidebar** : "Consultation gratuite", téléphone, WhatsApp ("Décrivez-nous votre projet")
- **ReadingProgress** : barre de progression lecture

---

## Phase 8 — Configuration SEO Centralisée (`seoConfig.ts`)

### Structure (identique BKS)

```typescript
export interface BlogPostSEO {
  slug: string;
  title: string;              // 60 car max, nombre + bénéfice
  metaDescription: string;    // 155-160 car, stat + promesse
  excerpt: string;
  category: 'import' | 'accompagnement' | 'fiscalite' | 'comparatif' | 'occasion' | 'financement';
  keywords: string[];
}

export const BLOG_SEO_CONFIG: Record<string, BlogPostSEO> = {
  'import-voiture-allemagne': {
    slug: 'import-voiture-allemagne',
    title: 'Import Voiture Allemagne : Guide Complet 2026',
    metaDescription: '20-30% d\'économie sur votre véhicule importé d\'Allemagne. Démarches, coûts réels, pièges à éviter. ✓ Guide vérifié par nos experts.',
    excerpt: 'Tout savoir pour importer votre véhicule d\'Allemagne sans mauvaise surprise.',
    category: 'import',
    keywords: ['import voiture allemagne', 'acheter voiture allemagne', 'mandataire auto allemagne'],
  },
  // ... 50+ articles à créer
};
```

### Formule des Titres (Pattern BKS)

```
[Sujet] : [Nombre] [Bénéfice/Action] ([Année])
```

**Exemples** :

- "Import Voiture Allemagne : 5 Étapes Clés (2026)"
- "TVA Import Auto : 3 Erreurs à Éviter (2026)"
- "Contrôle Technique Import : Guide Complet (2026)"

### Formule des Meta Descriptions

```
[Stat choc] + [Promesse concrète] + [CTA implicite]. ✓ [Preuve sociale]
```

**Exemples** :

- "20-30% d'économie moyenne sur un import Allemagne. Guide complet : démarches, coûts, délais. ✓ +500 véhicules importés."
- "TVA récupérable ou non ? 3 erreurs qui coûtent cher. Calcul exact + cas pratiques. ✓ Experts import auto."

---

## Phase 9 — Règles de Rédaction d'Articles

### 9.1 Structure Immuable (Squelette)

1. **Frontmatter YAML** (métadonnées)
2. **H1** : Accrocheur + mot-clé principal
3. **Introduction P.E.P** : Problème → Empathie → Promesse
4. **Boîte de Définition** (40-60 mots, blockquote)
5. **Corps** : 3-7 sections H2 logiques
6. **FAQ** : 3-5 questions fréquentes (cibler les PAA Google)
7. **Conclusion** : Résumé + CTA

### 9.2 Règles de Style

| Règle | Détail |
|-------|--------|
| Ton | Professionnel, rassurant, direct. Vouvoiement |
| Phrases | Courtes. Max 20 mots idéalement |
| Paragraphes | 1 idée par paragraphe. 3-4 lignes max |
| Focus | Parlez de "Vous", pas "Nous" |
| Jargon | Toujours expliquer immédiatement |
| Longueur | Min 1000 mots (guides), 500 mots (actualités) |

### 9.3 Optimisation Position 0 (Featured Snippets)

**A. Answer-First** — chaque H2 commence par une réponse directe de 2-3 phrases :

```markdown
## Combien coûte l'import d'une voiture d'Allemagne ?
**Réponse directe :** Le coût total d'import se situe entre 800€ et 2500€ selon le véhicule, incluant transport (400-1200€), homologation (100-600€) et immatriculation (200-400€).

Détaillons chaque poste...
```

**B. Tableaux comparatifs** :

```markdown
| Pays d'import | Économie moyenne | Délai moyen | Difficulté |
|---------------|------------------|-------------|------------|
| Allemagne     | 20-30%           | 2-4 sem     | ★★☆        |
| Belgique      | 10-20%           | 1-2 sem     | ★☆☆        |
| Italie        | 15-25%           | 3-5 sem     | ★★★        |
```

**C. Listes numérotées** (processus) :

```markdown
### Comment importer une voiture en 5 étapes ?
1. Trouver le véhicule sur mobile.de ou AutoScout24
2. Vérifier l'historique (kilométrage, accidents)
3. Organiser le transport ou aller le chercher
4. Passer le contrôle technique français (UTAC)
5. Faire la carte grise française (ANTS)
```

**D. Cibler les PAA** : Rechercher les "People Also Ask" sur Google pour chaque mot-clé et les intégrer comme H3 dans la FAQ.

### 9.4 SEO & E-E-A-T

- **Mot-clé** dans : H1, intro, un H2, conclusion
- **Maillage interne** : 3-5 liens vers d'autres articles du blog
- **Sources** : Citer les sources officielles (service-public.fr, douanes.gouv.fr)
- **Alt text** : Descriptif sur chaque image
- **CTA discret** : 70% éducation, 30% conversion

### 9.5 Checklist Avant Publication

- [ ] Titre SEO ≤ 60 caractères + mot-clé
- [ ] Meta description 155-160 caractères + stat + promesse
- [ ] H1 unique = titre
- [ ] Introduction P.E.P
- [ ] Min 1000 mots (guides)
- [ ] FAQ 3-5 questions (ciblant PAA)
- [ ] ≥ 3 liens internes
- [ ] Images avec alt text
- [ ] CTA vers devis/contact

---

## Phase 10 — Stratégie de Contenu & Mots-Clés

### 10.1 Catégories d'Articles

| Catégorie | Objectif | Cible | Volume |
|-----------|----------|-------|--------|
| **Import** | Guides pays par pays, démarches | Foyers + Pros | 10 articles |
| **Accompagnement** | Pourquoi un courtier, comment ça marche | Tous | 6 articles |
| **Fiscalité** | TVA, douanes, malus, quitus | Foyers + Pros | 8 articles |
| **Comparatifs** | Prix France vs EU, modèles populaires | Foyers | 8 articles |
| **Occasion** | Vérifications, pièges, garanties EU | Foyers | 6 articles |
| **Financement** | Crédit, LOA, leasing, pros (TVS) | Entrepreneurs | 6 articles |

### 10.2 Articles Prioritaires (Top 20)

| # | Slug | Titre optimisé | Catégorie | Cible |
|---|------|----------------|-----------|-------|
| 1 | `import-voiture-allemagne` | Import Voiture Allemagne : Guide Complet 2026 | Import | Foyers |
| 2 | `courtier-auto-avantages` | Courtier Auto : 7 Raisons de Ne Plus Chercher Seul | Accompagnement | Tous |
| 3 | `tva-import-voiture-europe` | TVA Import Voiture Europe : Calcul et Récupération | Fiscalité | Tous |
| 4 | `mandataire-auto-vs-concessionnaire` | Mandataire vs Concessionnaire : Le Vrai Comparatif 2026 | Accompagnement | Foyers |
| 5 | `carte-grise-vehicule-importe` | Carte Grise Véhicule Importé : Démarches 2026 | Import | Tous |
| 6 | `acheter-voiture-occasion-europe` | Voiture Occasion Europe : 7 Vérifications Essentielles | Occasion | Foyers |
| 7 | `cahier-des-charges-voiture` | Comment Définir Son Cahier des Charges Voiture | Accompagnement | Tous |
| 8 | `mobile-de-guide-achat` | Mobile.de : Guide d'Achat pour Français | Import | Foyers |
| 9 | `autoscout24-acheter-france` | AutoScout24 : Comment Acheter Depuis la France | Import | Foyers |
| 10 | `malus-ecologique-import` | Malus Écologique Import : Simulateur et Astuces 2026 | Fiscalité | Tous |
| 11 | `import-voiture-belgique` | Import Voiture Belgique : Guide Pratique | Import | Foyers |
| 12 | `vehicule-entreprise-import` | Véhicule d'Entreprise : Pourquoi Importer en 2026 | Financement | Entrepreneurs |
| 13 | `comparatif-prix-france-allemagne` | Prix Voiture France vs Allemagne : Le Vrai Écart | Comparatifs | Foyers |
| 14 | `import-voiture-italie` | Import Voiture Italie : Avantages et Pièges | Import | Foyers |
| 15 | `financement-voiture-importee` | Financement Voiture Importée : Crédit, LOA, LLD | Financement | Tous |
| 16 | `transport-vehicule-europe-france` | Transport Véhicule Europe-France : Options et Prix | Import | Tous |
| 17 | `garantie-vehicule-importe` | Garantie Véhicule Importé : Vos Droits en 2026 | Occasion | Foyers |
| 18 | `homologation-vehicule-importe` | Homologation Véhicule Importé : Étapes et Coûts | Import | Tous |
| 19 | `loa-lld-import-europe` | LOA/LLD sur Véhicule Importé : Est-Ce Possible ? | Financement | Entrepreneurs |
| 20 | `arnaques-import-auto` | Arnaques Import Auto : 10 Signaux d'Alerte | Occasion | Foyers |

### 10.3 Questions pour Position 0 (FAQ par catégorie)

**Accompagnement / Courtier** :

- Qu'est-ce qu'un courtier automobile et comment ça marche ?
- Quelle est la différence entre un courtier auto et un mandataire ?
- Combien coûte un courtier automobile pour un import ?
- Pourquoi passer par un courtier plutôt que chercher soi-même ?

**Import** :

- Combien coûte l'import d'une voiture d'Allemagne ?
- Est-ce légal d'importer un véhicule d'un pays européen ?
- Quelles sont les étapes pour importer un véhicule en France ?

**Fiscalité** :

- Faut-il payer la TVA quand on importe une voiture d'Europe ?
- Comment récupérer la TVA sur un véhicule importé ?
- Le malus écologique s'applique-t-il aux véhicules importés ?

**Entrepreneurs** :

- Peut-on importer un véhicule de fonction depuis l'Europe ?
- Comment amortir un véhicule importé en entreprise ?
- Quels avantages fiscaux pour l'import de véhicules pros ?

---

## Phase 11 — Optimisation Performance & Conversion

### 11.1 Performance (Objectif Lighthouse > 90)

- **Images** : WebP, lazy loading, dimensions explicites, Cloudinary CDN
- **Fonts** : Self-hosted, preload, `font-display: swap`
- **Code** : Tree-shaking, code splitting (vendor/framer/cloudinary), terser
- **Cache** : Assets 1 an immutable, HTML must-revalidate, Cloudinary CacheFirst
- **CSS critique** : Inline dans `<style>` du `index.html`

### 11.2 Conversion (CTA adaptés au modèle courtier)

La conversion doit refléter le parcours courtier : **écoute du besoin → recherche → proposition**.

| Emplacement | Type CTA | Texte | Objectif |
|-------------|----------|-------|----------|
| Sidebar article (desktop) | Consultation | "Décrivez votre projet auto →" | Qualifier le lead |
| Bas article (mobile) | Appel + WhatsApp | "Consultation gratuite" / "Écrivez-nous" | Contact rapide |
| FAQ homepage | WhatsApp | "Une question ? On vous répond en 24h" | Engagement |
| Fin d'article | Maillage + CTA | "Articles similaires" + "On cherche pour vous" | Maillage + Lead |
| Pop-up sortie (optionnel) | Lead magnet | "Guide gratuit : les 10 pièges de l'import auto" | Capture email |
| Page d'accueil | Formulaire | "Quel véhicule cherchez-vous ?" (marque, budget, usage) | Lead qualifié |

### 11.3 PWA (Progressive Web App)

```typescript
VitePWA({
  manifest: {
    name: 'Doitz — Import Véhicules Europe',
    short_name: 'Doitz',
    description: 'Import de véhicules européens en France',
    theme_color: '#1A1A2E',
    // ...icons
  },
  workbox: {
    runtimeCaching: [
      { urlPattern: /cloudinary/, handler: 'CacheFirst', options: { cacheName: 'images', expiration: { maxEntries: 50, maxAgeSeconds: 2592000 } } },
      { urlPattern: /fonts/, handler: 'CacheFirst', options: { cacheName: 'fonts', expiration: { maxAgeSeconds: 31536000 } } },
    ]
  }
})
```

---

## Phase 12 — Déploiement & Monitoring

### 12.1 Déploiement Netlify

1. Créer repo GitHub
2. Connecter à Netlify : build `npm run build`, publish `dist`
3. Configurer env vars Cloudinary
4. Activer HTTPS (automatique)
5. Configurer domaine custom `doitz.fr`

### 12.2 Google Search Console

- [ ] Vérifier la propriété du domaine
- [ ] Soumettre le sitemap
- [ ] Vérifier la couverture d'indexation
- [ ] Monitorer les erreurs structured data
- [ ] Suivre : positions, CTR, impressions

### 12.3 KPIs & Monitoring

| Métrique | Objectif | Outil | Fréquence |
|----------|----------|-------|-----------|
| Position moyenne | < 5 | Search Console | Hebdo |
| CTR organique | > 5% | Search Console | Hebdo |
| Pages indexées | 100% | Search Console | Hebdo |
| Lighthouse mobile | > 90 | PageSpeed | Mensuel |
| Rich Snippets | Actifs | Rich Results Test | Mensuel |
| Trafic organique | +20%/mois | Analytics | Mensuel |

### 12.4 Validation Post-Déploiement

- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) > 90
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) — schemas OK
- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug/) — OG OK
- [ ] HTTPS + cadenas vert
- [ ] Sitemap accessible à `/sitemap.xml`
- [ ] robots.txt accessible à `/robots.txt`

---

## Checklist Finale

### Infrastructure

- [ ] Projet Vite + React + TypeScript créé
- [ ] SSG configuré (`vite-react-ssg`)
- [ ] PWA configurée
- [ ] Netlify déployé avec HTTPS

### SEO Technique

- [ ] `robots.txt` avec sitemap + bots IA
- [ ] `sitemap.xml` auto-généré au build
- [ ] `index.html` avec favicons, preloads, meta robots, noscript
- [ ] `netlify.toml` avec headers sécurité + cache + redirects 301
- [ ] Trailing slashes redirigés en 301

### Composants SEO

- [ ] `SEO.tsx` avec title, description, canonical, OG, Twitter, JSON-LD
- [ ] `structuredData.ts` avec LocalBusiness, Article, FAQ, Breadcrumb, HowTo
- [ ] `seoConfig.ts` avec base de données SEO centralisée
- [ ] Breadcrumbs sur chaque page

### Blog

- [ ] Page liste blog avec filtres + pagination
- [ ] Page article avec hero, ToC, sidebar CTA, articles similaires
- [ ] Markdown articles avec frontmatter complet
- [ ] `ReadingProgress`, `TableOfContents`, `ArticleContent`
- [ ] Maillage interne (articles similaires)

### Contenu

- [ ] 15 articles prioritaires rédigés
- [ ] Chaque article suit la structure P.E.P + FAQ
- [ ] Titres optimisés (60 car, nombre + bénéfice)
- [ ] Meta descriptions (155-160 car, stat + promesse)
- [ ] Position 0 : answer-first, tableaux, listes numérotées
- [ ] PAA Google ciblées dans chaque FAQ

### Conversion

- [ ] CTA sidebar desktop (devis)
- [ ] CTA mobile bas d'article
- [ ] WhatsApp intégré
- [ ] Lead magnet (checklist import PDF)

### Monitoring

- [ ] Google Search Console configuré
- [ ] Sitemap soumis
- [ ] Analytics installé
- [ ] Rich Results validés

---

> [!TIP]
> **Ordre d'implémentation recommandé** : Phases 1-2 (infra + SEO technique) → Phase 3-4 (schemas + SEO component) → Phase 5-7 (blog système) → Phase 8 (seoConfig) → Phase 10 (rédaction 15 articles) → Phase 11-12 (perf + déploiement)

---

**Document créé** : 15 février 2026  
**Basé sur** : Analyse complète du site BKS (Batignolles Kiné Sport)  
**Objectif** : Devenir la référence #1 pour les acheteurs de véhicules importés en France
