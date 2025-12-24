
import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Book, Trash2, Calendar, Save, Heart } from 'lucide-react';
import { NotebookSession } from '../types';

interface LibraryProps {
  notebooks: NotebookSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

const Library: React.FC<LibraryProps> = ({ notebooks, activeId, onSelect, onDelete, onCreate, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-pink-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border-[10px] border-white"
      >
        {/* Header */}
        <div className="bg-pink-50 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-pink-100">
          <div>
            <h2 className="text-3xl font-bold text-pink-600 flex items-center gap-3">
              <Book className="text-pink-400" />
              Notebook Library
            </h2>
            <p className="text-pink-400 text-sm mt-1">Access your previous notes and manage your collection</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onCreate}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-pink-200 transition-all active:scale-95"
            >
              <Plus size={20} />
              Start New Note
            </button>
            <button onClick={onClose} className="p-3 hover:bg-pink-100 rounded-full text-pink-300">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* List of Notebooks */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-rose-50/20">
          {notebooks.map((nb) => (
            <motion.div
              key={nb.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative group cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all ${
                activeId === nb.id 
                  ? 'bg-white border-pink-400 shadow-xl ring-4 ring-pink-50' 
                  : 'bg-white/80 border-pink-50 hover:border-pink-200 shadow-sm'
              }`}
              onClick={() => onSelect(nb.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-16 rounded-xl ${
                  nb.theme.color === 'pink' ? 'bg-pink-400' :
                  nb.theme.color === 'mint' ? 'bg-emerald-400' :
                  nb.theme.color === 'lavender' ? 'bg-purple-400' :
                  nb.theme.color === 'lemon' ? 'bg-yellow-400' : 'bg-sky-400'
                } shadow-md border-r-8 border-black/10 flex items-center justify-center text-white relative`}>
                   <Book size={24} />
                   <div className="absolute top-2 left-1 w-1 h-12 bg-white/20 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(nb.id); }}
                    className="p-2 opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-500 transition-opacity"
                    title="Delete Notebook"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 text-lg truncate mb-1">{nb.name || 'Lovely Notebook'}</h3>
              <div className="flex items-center gap-2 text-xs text-pink-300 font-medium">
                <Calendar size={12} />
                <span>Last updated: {new Date(nb.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {nb.pages.length} {nb.pages.length === 1 ? 'Page' : 'Pages'}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {nb.attachments.length} Decor
                </span>
              </div>

              {activeId === nb.id && (
                <div className="absolute top-4 right-4 text-pink-500 animate-pulse">
                  <Heart size={20} fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Library Footer with explicit Save confirmation */}
        <div className="p-6 bg-pink-50 flex items-center justify-center gap-4 border-t border-pink-100">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-widest">
            <Save size={16} />
            Your notes are auto-saved here
          </div>
          <div className="w-1 h-1 bg-pink-200 rounded-full" />
          <div className="text-[10px] text-pink-300 italic">Total Notebooks: {notebooks.length}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Library;
