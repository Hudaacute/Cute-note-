
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, GripHorizontal, Move } from 'lucide-react';
import { Attachment } from '../types';

interface DraggableElementProps {
  item: Attachment;
  onDelete: () => void;
  onUpdate: (updates: Partial<Attachment>) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ item, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.x, y: item.y, rotate: Math.random() * 6 - 3 }}
      className={`absolute z-[100] group cursor-grab active:cursor-grabbing transition-shadow hover:shadow-xl`}
      style={{ touchAction: 'none' }}
    >
      <div className="relative">
        {/* Controls */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-lg border border-pink-100 z-50">
          <button 
            onClick={onDelete}
            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-full"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <div className="h-4 w-px bg-pink-100" />
          <div className="p-1.5 text-pink-300 cursor-move">
            <Move size={16} />
          </div>
        </div>

        {item.type === 'image' ? (
          <div className="p-2 bg-white shadow-md border-4 border-white rounded-sm rotate-2">
            <img 
              src={item.content} 
              alt="Attachment" 
              className="max-w-[200px] max-h-[300px] object-contain block pointer-events-none"
            />
            <div className="mt-2 h-4 w-full bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-20" />
          </div>
        ) : (
          <div className="w-48 p-4 bg-amber-100/90 shadow-lg -rotate-1 relative overflow-hidden flex flex-col min-h-[120px]">
            {/* Sticky note tape/tack */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 border-b border-amber-200" />
            
            <textarea
              value={item.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="bg-transparent border-none focus:ring-0 text-amber-900 notebook-font text-lg leading-6 flex-1 resize-none placeholder:text-amber-700/30"
              placeholder="Memo..."
            />
            
            {/* Cute heart decor on sticky */}
            <div className="absolute bottom-2 right-2 text-amber-400/50">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DraggableElement;
