import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, '..', 'src', 'posts', 'articles');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-metadata.json');

function parseFrontmatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!match) return {};

    const frontmatter = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        // Parse booleans
        if (value === 'true') { frontmatter[key] = true; continue; }
        if (value === 'false') { frontmatter[key] = false; continue; }

        // Parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                frontmatter[key] = JSON.parse(value);
                continue;
            } catch { /* not valid JSON */ }
        }

        frontmatter[key] = value;
    }

    return frontmatter;
}

function generateBlogMetadata() {
    // Create directories if they don't exist
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(ARTICLES_DIR)) {
        fs.mkdirSync(ARTICLES_DIR, { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, '[]');
        console.log('📝 No articles found. Created empty blog-metadata.json');
        return;
    }

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    const posts = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
        const frontmatter = parseFrontmatter(content);
        const slug = file.replace('.md', '');

        posts.push({
            slug,
            title: frontmatter.title || slug,
            category: frontmatter.category || 'general',
            type: frontmatter.type || 'Article',
            readTime: frontmatter.readTime || '5 min',
            image: frontmatter.image || '',
            excerpt: frontmatter.excerpt || '',
            publishedAt: frontmatter.publishedAt || new Date().toISOString(),
            featured: frontmatter.featured || false,
            keywords: frontmatter.keywords || [],
        });
    }

    // Sort by date (most recent first)
    posts.sort((a, b) => {
        const dateA = new Date(a.publishedAt);
        const dateB = new Date(b.publishedAt);
        return dateB.getTime() - dateA.getTime();
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
    console.log(`✅ Generated blog-metadata.json with ${posts.length} articles`);
}

generateBlogMetadata();
