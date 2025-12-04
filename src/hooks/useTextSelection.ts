
import { useState, useEffect, useRef } from 'react';

export const useTextSelection = (containerRef: React.RefObject<HTMLElement>) => {
  const [selectedText, setSelectedText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setSelectedText('');
        setHasSelection(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedContent = range.toString().trim();

      // Check if selection is within our container
      if (containerRef.current && range.commonAncestorContainer) {
        const isWithinContainer = containerRef.current.contains(
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer
        );

        if (isWithinContainer && selectedContent.length > 0) {
          setSelectedText(selectedContent);
          setHasSelection(true);
        } else {
          setSelectedText('');
          setHasSelection(false);
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [containerRef]);

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setSelectedText('');
    setHasSelection(false);
  };

  return {
    selectedText,
    hasSelection,
    clearSelection
  };
};
