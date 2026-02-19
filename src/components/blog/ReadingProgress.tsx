import React, { useState, useEffect } from 'react';

const ReadingProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / docHeight) * 100;
            setProgress(Math.min(scrolled, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ReadingProgress;
