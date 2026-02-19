import { marked } from 'marked';

export interface BlogFrontmatter {
    title: string;
    category: string;
    type: string;
    readTime: string;
    image: string;
    excerpt: string;
    publishedAt: string;
    featured: boolean;
    keywords: string[];
    slug?: string;
}

export interface BlogPost {
    frontmatter: BlogFrontmatter;
    content: string;
    slug: string;
}

export interface HeadingItem {
    id: string;
    text: string;
    level: number;
}

export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Parse frontmatter from markdown string
 */
export function parseFrontmatter(markdown: string): { frontmatter: Record<string, any>; content: string } {
    const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content: markdown };

    const frontmatterStr = match[1];
    const content = match[2];
    const frontmatter: Record<string, any> = {};

    for (const line of frontmatterStr.split('\n')) {
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

        // Parse arrays (simple single-line arrays)
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                frontmatter[key] = JSON.parse(value);
                continue;
            } catch {
                // not valid JSON, treat as string
            }
        }

        frontmatter[key] = value;
    }

    return { frontmatter, content };
}

/**
 * Extract headings from markdown content for Table of Contents
 */
export function extractHeadings(markdown: string): HeadingItem[] {
    const headings: HeadingItem[] = [];
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
        const id = text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        headings.push({ id, text, level });
    }

    return headings;
}

/**
 * Extract FAQ items from markdown for FAQPage schema.
 * Detects h3 questions under a ## FAQ heading and extracts the following paragraph as the answer.
 */
export function extractFAQs(markdown: string): FAQItem[] {
    const faqs: FAQItem[] = [];

    // Find the FAQ section — look for ## FAQ or ## Questions fréquentes
    const faqSectionRegex = /^##\s+(?:FAQ|Questions?\s+fr[ée]quentes?)[^\n]*$/im;
    const faqMatch = faqSectionRegex.exec(markdown);
    if (!faqMatch) return faqs;

    // Get content after FAQ heading until next ## or end of file
    const faqStart = faqMatch.index + faqMatch[0].length;
    const nextH2 = markdown.indexOf('\n## ', faqStart + 1);
    const faqContent = nextH2 === -1 ? markdown.slice(faqStart) : markdown.slice(faqStart, nextH2);

    // Extract h3 questions and their answer content
    const questionRegex = /^###\s+(.+?)(?:\s*\?)?\s*$/gm;
    let qMatch;
    const questions: Array<{ question: string; index: number }> = [];

    while ((qMatch = questionRegex.exec(faqContent)) !== null) {
        const questionText = qMatch[1].trim();
        // Ensure it ends with ?
        const q = questionText.endsWith('?') ? questionText : questionText + ' ?';
        questions.push({ question: q, index: qMatch.index + qMatch[0].length });
    }

    // Extract answers (content between questions)
    for (let i = 0; i < questions.length; i++) {
        const start = questions[i].index;
        const end = i + 1 < questions.length ? questions[i + 1].index - (questions[i + 1].question.length + 5) : faqContent.length;
        const answerRaw = faqContent.slice(start, end).trim();
        // Clean markdown formatting for schema (strip **, *, links)
        const answer = answerRaw
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^[-*]\s+/gm, '• ')
            .replace(/\n{2,}/g, ' ')
            .replace(/\n/g, ' ')
            .trim();

        if (answer.length > 10) {
            faqs.push({ question: questions[i].question, answer });
        }
    }

    return faqs;
}

/**
 * Count words in markdown content (excluding frontmatter)
 */
export function countWords(markdown: string): number {
    const clean = markdown
        .replace(/[#*_`\[\]\(\)>|]/g, ' ')
        .replace(/-{3,}/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return clean.split(' ').filter(w => w.length > 0).length;
}

/**
 * Render markdown to HTML with heading IDs.
 * Strips H1 headings since the page component renders the title.
 */
export function renderMarkdown(markdown: string): string {
    // Strip H1 headings from content (page component renders the title as H1)
    const contentWithoutH1 = markdown.replace(/^#\s+.+$/gm, '');

    const renderer = new marked.Renderer();

    // Add IDs to headings for anchor links
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
        const id = text
            .replace(/<[^>]*>/g, '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        return `<h${depth} id="${id}">${text}</h${depth}>`;
    };

    // Make links open in new tab
    renderer.link = ({ href, text }: { href: string; text: string }) => {
        const isExternal = href.startsWith('http');
        const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${href}"${attrs}>${text}</a>`;
    };

    marked.setOptions({
        renderer,
        gfm: true,
        breaks: false,
    });

    return marked.parse(contentWithoutH1) as string;
}
