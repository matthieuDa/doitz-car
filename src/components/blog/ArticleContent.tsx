import React from 'react';

interface ArticleContentProps {
    html: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ html }) => {
    return (
        <article
            className="prose prose-lg max-w-none
        prose-headings:font-display prose-headings:font-bold prose-headings:text-white
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
        prose-strong:text-white prose-strong:font-semibold
        prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:text-slate-300 prose-blockquote:not-italic
        prose-ul:text-slate-300 prose-ol:text-slate-300
        prose-li:marker:text-blue-400
        prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
        prose-table:border-collapse
        prose-th:bg-slate-800/50 prose-th:text-white prose-th:font-semibold prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-white/10
        prose-td:p-3 prose-td:border prose-td:border-white/10 prose-td:text-slate-300
        prose-img:rounded-xl prose-img:border prose-img:border-white/10
        prose-hr:border-white/10
      "
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default ArticleContent;
