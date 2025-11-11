import { useState, useEffect } from 'react';
import { CaptionStyle } from '@/components/messaging/CaptionFormatting';

export interface CaptionTemplate {
  id: string;
  name: string;
  style: CaptionStyle;
}

export const CAPTION_TEMPLATES: CaptionTemplate[] = [
  {
    id: 'default',
    name: 'Default',
    style: {
      fontFamily: 'inter',
      fontSize: 'base',
      color: '#000000',
      bold: false,
      italic: false,
    },
  },
  {
    id: 'bold-title',
    name: 'Bold Title',
    style: {
      fontFamily: 'inter',
      fontSize: 'lg',
      color: '#000000',
      bold: true,
      italic: false,
    },
  },
  {
    id: 'subtle',
    name: 'Subtle Caption',
    style: {
      fontFamily: 'inter',
      fontSize: 'sm',
      color: '#6B7280',
      bold: false,
      italic: true,
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    style: {
      fontFamily: 'playfair',
      fontSize: 'lg',
      color: '#8B5CF6',
      bold: true,
      italic: false,
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    style: {
      fontFamily: 'playfair',
      fontSize: 'base',
      color: '#1F2937',
      bold: false,
      italic: true,
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    style: {
      fontFamily: 'roboto',
      fontSize: 'base',
      color: '#3B82F6',
      bold: true,
      italic: false,
    },
  },
];

const STORAGE_KEY = 'caption-default-style';

export const useCaptionPreferences = () => {
  const [defaultStyle, setDefaultStyle] = useState<CaptionStyle>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : CAPTION_TEMPLATES[0].style;
    } catch {
      return CAPTION_TEMPLATES[0].style;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStyle));
    } catch (error) {
      console.error('Failed to save caption preferences:', error);
    }
  }, [defaultStyle]);

  const applyTemplate = (templateId: string) => {
    const template = CAPTION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setDefaultStyle(template.style);
    }
  };

  return {
    defaultStyle,
    setDefaultStyle,
    applyTemplate,
    templates: CAPTION_TEMPLATES,
  };
};
