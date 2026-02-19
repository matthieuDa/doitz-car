import type { BlogFrontmatter } from './markdownRenderer';

/**
 * Get similar blog posts based on category
 */
export function getSimilarPosts(
    currentSlug: string,
    currentCategory: string,
    allPosts: Array<BlogFrontmatter & { slug: string }>,
    count: number = 3
): Array<BlogFrontmatter & { slug: string }> {
    // First try same category
    const sameCategoryPosts = allPosts
        .filter(p => p.slug !== currentSlug && p.category === currentCategory);

    if (sameCategoryPosts.length >= count) {
        return sameCategoryPosts.slice(0, count);
    }

    // Fill with other posts
    const otherPosts = allPosts
        .filter(p => p.slug !== currentSlug && p.category !== currentCategory);

    return [...sameCategoryPosts, ...otherPosts].slice(0, count);
}
