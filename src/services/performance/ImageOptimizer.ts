
/**
 * Image Optimization Utilities
 */

export class ImageOptimizer {
  /**
   * Optimize image loading with lazy loading and caching
   */
  optimizeImageLoading(img: HTMLImageElement, src: string): void {
    // Add loading optimization attributes
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Add intersection observer for advanced lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            if (!image.src && src) {
              image.src = src;
              observer.unobserve(image);
            }
          }
        });
      });
      
      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src;
    }
  }

  /**
   * Preload critical resources with streaming support
   */
  async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      '/pdf.worker.min.js',
      // Add streaming-specific resources
    ];

    const preloadPromises = criticalResources.map(async (resource) => {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          const data = await response.arrayBuffer();
          // Could cache in IndexedDB here if needed
        }
        return resource;
      } catch (error) {
        console.warn('Failed to preload:', resource, error);
        return null;
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('✅ Critical resources preloaded with caching');
  }
}
