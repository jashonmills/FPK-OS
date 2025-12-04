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
const CUSTOM_TEMPLATES_KEY = 'caption-custom-templates';

export const useCaptionPreferences = () => {
  const [defaultStyle, setDefaultStyle] = useState<CaptionStyle>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : CAPTION_TEMPLATES[0].style;
    } catch {
      return CAPTION_TEMPLATES[0].style;
    }
  });

  const [customTemplates, setCustomTemplates] = useState<CaptionTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStyle));
    } catch (error) {
      console.error('Failed to save caption preferences:', error);
    }
  }, [defaultStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
    } catch (error) {
      console.error('Failed to save custom templates:', error);
    }
  }, [customTemplates]);

  const applyTemplate = (templateId: string) => {
    // Check built-in templates first
    const builtInTemplate = CAPTION_TEMPLATES.find(t => t.id === templateId);
    if (builtInTemplate) {
      setDefaultStyle(builtInTemplate.style);
      return;
    }
    
    // Check custom templates
    const customTemplate = customTemplates.find(t => t.id === templateId);
    if (customTemplate) {
      setDefaultStyle(customTemplate.style);
    }
  };

  const addCustomTemplate = (name: string, style: CaptionStyle): boolean => {
    // Check if name already exists
    const exists = customTemplates.some(t => t.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return false;
    }

    const newTemplate: CaptionTemplate = {
      id: `custom-${Date.now()}`,
      name,
      style,
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    return true;
  };

  const removeCustomTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const allTemplates = [...CAPTION_TEMPLATES, ...customTemplates];

  return {
    defaultStyle,
    setDefaultStyle,
    applyTemplate,
    templates: CAPTION_TEMPLATES,
    customTemplates,
    addCustomTemplate,
    removeCustomTemplate,
    allTemplates,
  };
};
