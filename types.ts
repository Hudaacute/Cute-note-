
export type LineStyle = 'college' | 'wide' | 'dotted' | 'blank';
export type NotebookColor = 'pink' | 'mint' | 'lavender' | 'lemon' | 'sky';
export type TextureStyle = 'plain' | 'grain' | 'grid';

export interface NotebookTheme {
  lineStyle: LineStyle;
  color: NotebookColor;
  texture: TextureStyle;
}

export interface Attachment {
  id: string;
  type: 'image' | 'sticky';
  x: number;
  y: number;
  content: string; // URL for image, text for sticky
  width?: number;
  height?: number;
}

export interface PageData {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface NotebookSession {
  id: string;
  name: string;
  updatedAt: number;
  pages: PageData[];
  attachments: Attachment[];
  theme: NotebookTheme;
}

export interface AppState {
  currentPageIndex: number;
  pages: PageData[];
  attachments: Attachment[];
  theme: NotebookTheme;
}
