import { useState, useMemo, useCallback } from 'react';

interface UseVirtualPaginationOptions {
  pageHeight?: number;
  containerWidth?: number;
  minElementsPerPage?: number;
}

interface UseVirtualPaginationReturn {
  pages: string[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Virtual Pagination Hook
 * Intelligently splits HTML content into page-sized chunks for a paginated reading experience
 */
export function useVirtualPagination(
  htmlContent: string,
  options: UseVirtualPaginationOptions = {}
): UseVirtualPaginationReturn {
  const { pageHeight = 900, containerWidth = 800, minElementsPerPage = 3 } = options;
  const [currentPage, setCurrentPage] = useState(0);

  // Parse HTML and create virtual pages
  const pages = useMemo(() => {
    if (!htmlContent || htmlContent.trim() === '') {
      return ['<p>No content available</p>'];
    }

    try {
      // Parse HTML into DOM
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const elements = Array.from(doc.body.children);

      if (elements.length === 0) {
        return [htmlContent];
      }

      // Create temporary measuring container with dynamic width
      const measuringDiv = document.createElement('div');
      measuringDiv.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${containerWidth}px;
        padding: 1.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
      `;
      document.body.appendChild(measuringDiv);

      const virtualPages: string[] = [];
      let currentPageElements: Element[] = [];
      let currentPageHeight = 0;
      
      // Allow 20% overflow tolerance before forcing new page
      const OVERFLOW_TOLERANCE = 1.2;
      const effectivePageHeight = pageHeight * OVERFLOW_TOLERANCE;

      elements.forEach((element, index) => {
        // Measure element height
        measuringDiv.innerHTML = element.outerHTML;
        const elementHeight = measuringDiv.offsetHeight;
        
        // Check if next element is small (heading or short paragraph)
        const isSmallElement = elementHeight < pageHeight * 0.15;

        // Check if we should start a new page
        const wouldExceedPageHeight = currentPageHeight + elementHeight > effectivePageHeight;
        const hasMinimumElements = currentPageElements.length >= minElementsPerPage;
        
        // Don't break if this is a small element or if we'd create an orphan
        const shouldKeepTogether = isSmallElement || currentPageElements.length < 2;

        if (wouldExceedPageHeight && hasMinimumElements && !shouldKeepTogether) {
          // Save current page and start new one
          virtualPages.push(
            currentPageElements.map(el => el.outerHTML).join('\n')
          );
          currentPageElements = [element];
          currentPageHeight = elementHeight;
        } else {
          // Add to current page
          currentPageElements.push(element);
          currentPageHeight += elementHeight;
        }

        // Handle last element
        if (index === elements.length - 1 && currentPageElements.length > 0) {
          virtualPages.push(
            currentPageElements.map(el => el.outerHTML).join('\n')
          );
        }
      });

      // Cleanup
      document.body.removeChild(measuringDiv);
      
      console.log('[Pagination] Generated pages:', {
        totalPages: virtualPages.length,
        totalElements: elements.length,
        avgElementsPerPage: Math.round(elements.length / virtualPages.length),
        effectivePageHeight,
        containerWidth
      });

      return virtualPages.length > 0 ? virtualPages : [htmlContent];
    } catch (error) {
      console.error('[useVirtualPagination] Error creating pages:', error);
      return [htmlContent];
    }
  }, [htmlContent, pageHeight, containerWidth, minElementsPerPage]);

  const totalPages = pages.length;

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  return {
    pages,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  };
}
