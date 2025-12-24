
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
      pink: { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-500', line: '#fecdd3', spiral: 'bg-pink-300' },
      mint: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-500', line: '#a7f3d0', spiral: 'bg-emerald-300' },
      lavender: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-500', line: '#ddd6fe', spiral: 'bg-purple-300' },
      lemon: { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-500', line: '#fef08a', spiral: 'bg-yellow-300' },
      sky: { bg: 'bg-sky-100', border: 'border-sky-200', text: 'text-sky-500', line: '#bae6fd', spiral: 'bg-sky-300' },
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

  // Ensure content is loaded when the page changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== page.content) {
      contentRef.current.innerHTML = page.content;
    }
  }, [page.id, page.content]);

  const handleInput = () => {
    if (contentRef.current) {
      onUpdate({ content: contentRef.current.innerHTML });
    }
  };

  return (
    <div className="relative group">
      {/* Paper Stack Effect */}
      <div className="absolute top-2 left-2 w-full h-full bg-white/50 rounded-3xl -z-10 translate-x-1 translate-y-1 border border-black/5" />
      <div className="absolute top-4 left-4 w-full h-full bg-white/30 rounded-3xl -z-20 translate-x-2 translate-y-2 border border-black/5" />

      <motion.div 
        layout
        className={`relative w-full max-w-[800px] ${themeStyles.colors.bg} rounded-3xl p-6 shadow-2xl border-[12px] border-white ring-1 ${themeStyles.colors.border}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Spiral Binder Effect */}
        <div className="absolute -left-6 top-12 bottom-12 w-6 flex flex-col justify-around py-4 z-50">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="relative flex items-center justify-end w-full h-4">
              <div className={`w-8 h-2 ${themeStyles.colors.spiral} rounded-full shadow-inner border border-black/10 -mr-3`} />
              <div className="w-4 h-4 rounded-full bg-white border border-black/5 absolute -right-2" />
            </div>
          ))}
        </div>

        {/* Header Badge */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-8 py-2 rounded-full border ${themeStyles.colors.border} shadow-sm flex items-center gap-3 z-20`}>
          <div className={`${themeStyles.colors.text} font-bold uppercase tracking-widest text-[10px]`}>Personal Memories</div>
          <Heart size={12} className={themeStyles.colors.text} fill="currentColor" />
        </div>

        {/* The Page Area */}
        <div 
          className="bg-white rounded-xl h-full min-h-[700px] shadow-inner p-8 relative flex flex-col overflow-hidden"
          style={{ backgroundImage: themeStyles.texture, backgroundBlendMode: 'multiply' }}
        >
          <div className="absolute inset-0 border-[20px] border-rose-50/10 pointer-events-none opacity-50" />
          
          <div className={`flex justify-between items-center border-b-2 border-dashed ${themeStyles.colors.border} pb-4 mb-6 mt-4`}>
            <div className="flex items-center gap-2">
              <span className={`${themeStyles.colors.text} font-bold text-xs opacity-40`}>Subject:</span>
              <input 
                type="text" 
                value={page.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className={`border-none focus:ring-0 ${themeStyles.colors.text.replace('500', '700')} font-semibold bg-transparent placeholder:opacity-30 text-lg notebook-font`}
                placeholder="Title here..."
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={`${themeStyles.colors.text} font-bold text-[10px] opacity-40 uppercase tracking-tighter`}>Recorded:</span>
              <input 
                type="text" 
                value={page.date}
                onChange={(e) => onUpdate({ date: e.target.value })}
                className={`border-none focus:ring-0 ${themeStyles.colors.text.replace('500', '700')} text-[10px] bg-transparent w-24 text-right notebook-font opacity-70 font-bold`}
              />
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute bottom-4 right-4 z-0 opacity-10 select-none pointer-events-none">
              <div className={`w-24 h-24 rounded-full border-4 ${themeStyles.colors.border} bg-pink-50 flex items-center justify-center`}>
                <Heart size={40} className={themeStyles.colors.text} fill="currentColor" />
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
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center text-[10px] font-bold tracking-widest px-2">
                {current} / {total}
              </div>
              <button 
                onClick={onNext}
                disabled={current === total}
                className={`p-2 rounded-full hover:bg-black/5 transition-colors ${current === total ? 'opacity-20' : ''}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 relative">
               <Bookmark size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notebook;
