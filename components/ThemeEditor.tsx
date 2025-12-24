
import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { NotebookTheme, LineStyle, NotebookColor, TextureStyle } from '../types';

interface ThemeEditorProps {
  theme: NotebookTheme;
  onChange: (theme: NotebookTheme) => void;
  onClose: () => void;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange, onClose }) => {
  const colors: { id: NotebookColor; class: string }[] = [
    { id: 'pink', class: 'bg-pink-300' },
    { id: 'mint', class: 'bg-emerald-300' },
    { id: 'lavender', class: 'bg-purple-300' },
    { id: 'lemon', class: 'bg-yellow-300' },
    { id: 'sky', class: 'bg-sky-300' },
  ];

  const lines: { id: LineStyle; label: string }[] = [
    { id: 'college', label: 'College' },
    { id: 'wide', label: 'Wide' },
    { id: 'dotted', label: 'Dotted' },
    { id: 'blank', label: 'Blank' },
  ];

  const textures: { id: TextureStyle; label: string }[] = [
    { id: 'plain', label: 'Plain' },
    { id: 'grain', label: 'Grain' },
    { id: 'grid', label: 'Grid' },
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed top-24 right-8 z-[150] w-64 bg-white/90 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-2xl p-6 flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-pink-600 font-bold tracking-tight">Theme Magic</h3>
        <button onClick={onClose} className="p-1 text-pink-300 hover:text-pink-500">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <section>
          <label className="text-xs font-bold uppercase text-pink-300 tracking-widest mb-2 block">Notebook Color</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ ...theme, color: c.id })}
                className={`w-8 h-8 rounded-full ${c.class} shadow-inner transition-transform active:scale-90 flex items-center justify-center`}
              >
                {theme.color === c.id && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-bold uppercase text-pink-300 tracking-widest mb-2 block">Line Style</label>
          <div className="grid grid-cols-2 gap-2">
            {lines.map((l) => (
              <button
                key={l.id}
                onClick={() => onChange({ ...theme, lineStyle: l.id })}
                className={`text-xs py-1.5 px-3 rounded-full border transition-colors ${
                  theme.lineStyle === l.id 
                    ? 'bg-pink-500 border-pink-500 text-white' 
                    : 'bg-white border-pink-100 text-pink-400 hover:border-pink-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-bold uppercase text-pink-300 tracking-widest mb-2 block">Paper Texture</label>
          <div className="grid grid-cols-3 gap-2">
            {textures.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange({ ...theme, texture: t.id })}
                className={`text-[10px] py-1.5 rounded-lg border transition-colors ${
                  theme.texture === t.id 
                    ? 'bg-pink-100 border-pink-300 text-pink-600' 
                    : 'bg-white border-pink-50 text-pink-300 hover:border-pink-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="text-[10px] text-center text-pink-200 italic">
        * Every dream is unique! *
      </div>
    </motion.div>
  );
};

export default ThemeEditor;
