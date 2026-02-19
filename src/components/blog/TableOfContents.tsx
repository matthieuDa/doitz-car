import React, { useState, useEffect } from 'react';
import type { HeadingItem } from '@/utils/markdownRenderer';

interface TableOfContentsProps {
    headings: HeadingItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-28 hidden xl:block">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Sommaire
            </h4>
            <ul className="space-y-1 border-l border-white/10">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`block py-1.5 text-sm transition-all duration-200 border-l-2 -ml-[2px] ${heading.level === 3 ? 'pl-6' : 'pl-4'
                                } ${activeId === heading.id
                                    ? 'text-blue-400 border-blue-400 font-medium'
                                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-white/20'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;
