
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  Image as ImageIcon, 
  StickyNote as StickyIcon,
  Sparkles,
  Palette,
  BookOpen,
  Save,
  Trash2
} from 'lucide-react';
import Notebook from './components/Notebook';
import DraggableElement from './components/DraggableElement';
import ThemeEditor from './components/ThemeEditor';
import Library from './components/Library';
import { PageData, Attachment, NotebookTheme, NotebookSession } from './types';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'kawaii_dream_notebooks';

const DEFAULT_THEME: NotebookTheme = {
  lineStyle: 'college',
  color: 'pink',
  texture: 'plain',
};

const createNewNotebook = (name: string = 'My New Notebook'): NotebookSession => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  updatedAt: Date.now(),
  pages: [{
    id: '1',
    title: 'Welcome',
    date: new Date().toLocaleDateString(),
    content: 'Start writing your lovely notes here...',
  }],
  attachments: [],
  theme: { ...DEFAULT_THEME },
});

const App: React.FC = () => {
  const [notebooks, setNotebooks] = useState<NotebookSession[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotebooks(parsed);
        if (parsed.length > 0) setActiveNotebookId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse stored notebooks", e);
      }
    } else {
      const initial = createNewNotebook('My First Notebook');
      setNotebooks([initial]);
      setActiveNotebookId(initial.id);
    }
  }, []);

  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId) || notebooks[0];

  const saveToStorage = useCallback((updatedNotebooks: NotebookSession[]) => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotebooks));
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, []);

  const updateActiveNotebook = (updates: Partial<NotebookSession>) => {
    const updatedNotebooks = notebooks.map(nb => 
      nb.id === activeNotebookId ? { ...nb, ...updates, updatedAt: Date.now() } : nb
    );
    setNotebooks(updatedNotebooks);
    saveToStorage(updatedNotebooks);
  };

  const handleCreateNotebook = () => {
    const newNb = createNewNotebook(`Notebook ${notebooks.length + 1}`);
    const updated = [newNb, ...notebooks];
    setNotebooks(updated);
    setActiveNotebookId(newNb.id);
    setCurrentPageIndex(0);
    saveToStorage(updated);
    setIsLibraryOpen(false);
  };

  const handleDeleteNotebook = (id: string) => {
    const updated = notebooks.filter(nb => nb.id !== id);
    if (updated.length === 0) {
      const fresh = createNewNotebook();
      setNotebooks([fresh]);
      setActiveNotebookId(fresh.id);
    } else {
      setNotebooks(updated);
      if (activeNotebookId === id) setActiveNotebookId(updated[0].id);
    }
    saveToStorage(updated);
  };

  const addPage = () => {
    const newPage: PageData = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Page',
      date: new Date().toLocaleDateString(),
      content: '',
    };
    const updatedPages = [...activeNotebook.pages, newPage];
    updateActiveNotebook({ pages: updatedPages });
    setCurrentPageIndex(updatedPages.length - 1);
  };

  const updatePage = (updates: Partial<PageData>) => {
    const newPages = [...activeNotebook.pages];
    newPages[currentPageIndex] = { ...newPages[currentPageIndex], ...updates };
    updateActiveNotebook({ pages: newPages });
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const url = readerEvent.target?.result as string;
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
          content: url,
        };
        updateActiveNotebook({ attachments: [...activeNotebook.attachments, newAttachment] });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticky = () => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'sticky',
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      content: 'New Note',
    };
    updateActiveNotebook({ attachments: [...activeNotebook.attachments, newAttachment] });
  };

  const removeAttachment = (id: string) => {
    updateActiveNotebook({ attachments: activeNotebook.attachments.filter(a => a.id !== id) });
  };

  const updateAttachment = (id: string, updates: Partial<Attachment>) => {
    updateActiveNotebook({ 
      attachments: activeNotebook.attachments.map(a => a.id === id ? { ...a, ...updates } : a) 
    });
  };

  const handlePolish = async () => {
    const currentPage = activeNotebook.pages[currentPageIndex];
    if (!currentPage.content.trim()) return;
    setIsPolishing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please make the following journal entry text more beautiful and poetic, while keeping the tone "cute" and "whimsical":\n\n${currentPage.content}`,
        config: {
            systemInstruction: "You are an assistant for a whimsical diary app. Use emojis and soft, friendly language."
        }
      });
      if (response.text) {
        updatePage({ content: response.text });
      }
    } catch (err) {
      console.error("AI Polish failed", err);
    } finally {
      setIsPolishing(false);
    }
  };

  if (!activeNotebook) return null;

  return (
    <div className="min-h-screen relative p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-10 left-10 text-pink-200 pointer-events-none -rotate-12">
        <Heart size={120} fill="currentColor" opacity={0.3} />
      </div>
      <div className="fixed bottom-10 right-10 text-pink-200 pointer-events-none rotate-12">
        <Heart size={160} fill="currentColor" opacity={0.3} />
      </div>

      {/* Main Cute Toolbar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-[200] bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-pink-200 flex items-center gap-2 md:gap-4 mb-8 sticky top-4 max-w-full overflow-x-auto no-scrollbar"
      >
        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all flex items-center gap-2 px-4 font-bold shadow-md active:scale-95"
          title="See previous notes"
        >
          <BookOpen size={20} />
          <span className="whitespace-nowrap">My Notebooks</span>
        </button>

        <div className="h-6 w-px bg-pink-200 mx-1 flex-shrink-0" />

        <button 
          onClick={addPage}
          className="p-2 hover:bg-pink-100 text-pink-600 rounded-full transition-colors flex items-center gap-2 px-3"
        >
          <Plus size={20} />
          <span className="hidden md:inline font-bold">New Page</span>
        </button>

        <label className="p-2 hover:bg-rose-50 rounded-full cursor-pointer text-rose-500 transition-colors flex items-center gap-2 px-3">
          <ImageIcon size={20} />
          <input type="file" className="hidden" accept="image/*" onChange={addImage} />
          <span className="hidden md:inline font-bold">Photo</span>
        </label>

        <button 
          onClick={addSticky}
          className="p-2 hover:bg-amber-50 rounded-full text-amber-500 transition-colors flex items-center gap-2 px-3"
        >
          <StickyIcon size={20} />
          <span className="hidden md:inline font-bold">Sticky</span>
        </button>

        <button 
          onClick={handlePolish}
          disabled={isPolishing}
          className={`p-2 hover:bg-purple-50 rounded-full text-purple-500 transition-colors flex items-center gap-2 px-3 ${isPolishing ? 'animate-pulse' : ''}`}
        >
          <Sparkles size={20} />
          <span className="hidden md:inline font-bold">AI Magic</span>
        </button>

        <div className="h-6 w-px bg-pink-200 mx-1 flex-shrink-0" />

        <button 
          onClick={() => setIsThemeEditorOpen(!isThemeEditorOpen)}
          className={`p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors flex items-center gap-2 px-3 ${isThemeEditorOpen ? 'bg-blue-50' : ''}`}
        >
          <Palette size={20} />
          <span className="hidden md:inline font-bold">Theme</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-pink-400 min-w-[80px] ml-2">
          {saveStatus === 'saving' ? <Sparkles size={14} className="animate-spin" /> : <Save size={14} />}
          <span className="hidden lg:inline uppercase tracking-tighter">{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Safe'}</span>
        </div>
      </motion.div>

      {/* Overlays */}
      <AnimatePresence>
        {isThemeEditorOpen && (
          <ThemeEditor 
            theme={activeNotebook.theme} 
            onChange={(theme) => updateActiveNotebook({ theme })} 
            onClose={() => setIsThemeEditorOpen(false)} 
          />
        )}
        {isLibraryOpen && (
          <Library 
            notebooks={notebooks}
            activeId={activeNotebookId}
            onSelect={(id) => { setActiveNotebookId(id); setIsLibraryOpen(false); setCurrentPageIndex(0); }}
            onDelete={handleDeleteNotebook}
            onCreate={handleCreateNotebook}
            onClose={() => setIsLibraryOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Workspace */}
      <div className="relative w-full max-w-6xl flex flex-col items-center min-h-[800px]">
        {/* Notebook */}
        <Notebook 
          page={activeNotebook.pages[currentPageIndex]} 
          theme={activeNotebook.theme}
          onUpdate={updatePage}
          total={activeNotebook.pages.length}
          current={currentPageIndex + 1}
          onPrev={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
          onNext={() => setCurrentPageIndex(Math.min(activeNotebook.pages.length - 1, currentPageIndex + 1))}
        />

        {/* Draggable Items */}
        {activeNotebook.attachments.map((att) => (
          <DraggableElement 
            key={att.id} 
            item={att} 
            onDelete={() => removeAttachment(att.id)}
            onUpdate={(updates) => updateAttachment(att.id, updates)}
          />
        ))}
      </div>

      <footer className="mt-12 text-pink-400 font-medium flex flex-col items-center gap-2 opacity-60">
        <div className="flex items-center gap-2">
          <Heart size={16} fill="currentColor" />
          <span>Currently Editing: {activeNotebook.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">Personal Notebook System</span>
          <span className="w-1 h-1 bg-pink-300 rounded-full" />
          <span className="text-[11px] font-semibold text-pink-500">Created by Huda</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
