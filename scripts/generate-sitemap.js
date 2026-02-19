import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://doitz.fr';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'sitemap.xml');
const METADATA_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-metadata.json');

const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
];

// Parse French date like "15 Février 2026" → "2026-02-15"
const MONTHS_FR = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
};

function parseFrenchDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const parts = dateStr.trim().split(' ');
    if (parts.length !== 3) return new Date().toISOString().split('T')[0];
    const day = parts[0].padStart(2, '0');
    const month = MONTHS_FR[parts[1].toLowerCase()] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
}

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    let blogPosts = [];

    if (fs.existsSync(METADATA_FILE)) {
        blogPosts = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Static routes
    for (const route of STATIC_ROUTES) {
        xml += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    }

    // Blog posts — use each article's actual publish date
    for (const post of blogPosts) {
        const lastmod = parseFrenchDate(post.publishedAt);
        xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`✅ Generated sitemap.xml with ${STATIC_ROUTES.length + blogPosts.length} URLs`);
}

generateSitemap();
