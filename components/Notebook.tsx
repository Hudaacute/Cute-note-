
import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, Heart } from 'lucide-react';
import { PageData, NotebookTheme } from '../types';

interface NotebookProps {
  page: PageData;
  theme: NotebookTheme;
  onUpdate: (updates: Partial<PageData>) => void;
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
}

const Notebook: React.FC<NotebookProps> = ({ page, theme, onUpdate, total, current, onPrev, onNext }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const themeStyles = useMemo(() => {
    const colors = {
      pink: { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-500', line: '#fecdd3' },
      mint: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-500', line: '#a7f3d0' },
      lavender: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-500', line: '#ddd6fe' },
      lemon: { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-500', line: '#fef08a' },
      sky: { bg: 'bg-sky-100', border: 'border-sky-200', text: 'text-sky-500', line: '#bae6fd' },
    };

    const lines = {
      college: { size: '100% 32px', img: `linear-gradient(transparent 31px, ${colors[theme.color].line} 32px)` },
      wide: { size: '100% 48px', img: `linear-gradient(transparent 47px, ${colors[theme.color].line} 48px)` },
      dotted: { size: '32px 32px', img: `radial-gradient(${colors[theme.color].line} 1.5px, transparent 1.5px)` },
      blank: { size: '100%', img: 'none' },
    };

    const textures = {
      plain: '',
      grain: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
      grid: "url('https://www.transparenttextures.com/patterns/subtle-grey-dots.png')",
    };

    return { colors: colors[theme.color], lines: lines[theme.lineStyle], texture: textures[theme.texture] };
  }, [theme]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== page.content) {
      contentRef.current.innerHTML = page.content;
    }
  }, [page.id]);

  const handleInput = () => {
    if (contentRef.current) {
      onUpdate({ content: contentRef.current.innerHTML });
    }
  };

  return (
    <motion.div 
      layout
      className={`relative w-full max-w-[800px] ${themeStyles.colors.bg} rounded-3xl p-6 shadow-2xl border-[12px] border-white ring-1 ${themeStyles.colors.border}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Header Badge */}
      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-8 py-2 rounded-full border ${themeStyles.colors.border} shadow-sm flex items-center gap-3 z-20`}>
        <div className="flex gap-1">
          {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${themeStyles.colors.bg.replace('100', '300')}`} />)}
        </div>
        <div className={`${themeStyles.colors.text} font-bold uppercase tracking-widest text-xs`}>My lovely notes</div>
        <div className="flex gap-1">
          {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${themeStyles.colors.bg.replace('100', '300')}`} />)}
        </div>
      </div>

      {/* The Page Area */}
      <div 
        className="bg-white rounded-xl h-full min-h-[700px] shadow-inner p-8 relative flex flex-col overflow-hidden"
        style={{ backgroundImage: themeStyles.texture, backgroundBlendMode: 'multiply' }}
      >
        <div className="absolute inset-0 border-[20px] border-rose-50/20 pointer-events-none opacity-50" />
        
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${themeStyles.colors.text} opacity-60`}>
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 20C40 0 10 0 10 20C10 40 40 40 60 20ZM60 20C80 0 110 0 110 20C110 40 80 40 60 20Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="60" cy="20" r="5" fill="currentColor"/>
          </svg>
        </div>

        <div className={`flex justify-between items-center border-b-2 border-dashed ${themeStyles.colors.border} pb-4 mb-6 mt-8`}>
          <div className="flex items-center gap-2">
            <span className={`${themeStyles.colors.text} font-bold text-sm opacity-60`}>Title:</span>
            <input 
              type="text" 
              value={page.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={`border-none focus:ring-0 ${themeStyles.colors.text.replace('500', '700')} font-semibold bg-transparent placeholder:opacity-30 text-lg notebook-font`}
              placeholder="Magic Memories..."
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={`${themeStyles.colors.text} font-bold text-sm opacity-60`}>Date:</span>
            <input 
              type="text" 
              value={page.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className={`border-none focus:ring-0 ${themeStyles.colors.text.replace('500', '700')} text-sm bg-transparent w-24 text-right notebook-font opacity-70`}
            />
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute bottom-4 right-4 z-0 opacity-20 select-none pointer-events-none">
            <img src="https://picsum.photos/seed/cute-cat/200/200" alt="Cute" className={`w-24 h-24 rounded-full border-4 ${themeStyles.colors.border}`} />
            <div className={`absolute -top-2 -left-2 ${themeStyles.colors.text}`}>
              <Heart fill="currentColor" size={20} />
            </div>
          </div>

          <div 
            ref={contentRef}
            contentEditable
            onInput={handleInput}
            className={`w-full h-[600px] outline-none bg-transparent text-gray-700 text-xl notebook-font relative z-10 overflow-y-auto whitespace-pre-wrap`}
            style={{ 
              backgroundImage: themeStyles.lines.img, 
              backgroundSize: themeStyles.lines.size,
              lineHeight: theme.lineStyle === 'wide' ? '48px' : '32px'
            }}
          />
        </div>

        <div className={`mt-4 flex justify-between items-center ${themeStyles.colors.text} opacity-60`}>
          <div className="flex gap-2">
             <button 
              onClick={onPrev}
              disabled={current === 1}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${current === 1 ? 'opacity-20' : ''}`}
            >
              <ChevronLeft />
            </button>
            <div className="flex items-center text-xs font-bold tracking-widest">
              PAGE {current} OF {total}
            </div>
            <button 
              onClick={onNext}
              disabled={current === total}
              className={`p-2 rounded-full hover:bg-black/5 transition-colors ${current === total ? 'opacity-20' : ''}`}
            >
              <ChevronRight />
            </button>
          </div>
          
          <div className="flex items-center gap-4 relative">
             <Bookmark size={20} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-20 flex flex-col gap-4">
        {[1,2,3].map(i => (
          <div key={i} className={`w-12 h-6 ${themeStyles.colors.bg.replace('100', '200')} rounded-r-lg shadow-md border-y border-r ${themeStyles.colors.border} relative`}>
            <div className="absolute top-1/2 right-2 w-2 h-2 rounded-full bg-white" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notebook;
