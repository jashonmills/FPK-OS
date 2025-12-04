/**
 * Image optimization utilities for SEO and performance
 */

export const generateSrcSet = (baseUrl: string, widths: number[] = [400, 800, 1200, 1600]) => {
  return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
};

export const generateSizes = (maxWidth: string = '100vw') => {
  return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${maxWidth}`;
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
};

export const isWebPSupported = (): boolean => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

export const convertToWebP = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
                type: 'image/webp',
              });
              resolve(webpFile);
            } else {
              reject(new Error('WebP conversion failed'));
            }
          },
          'image/webp',
          0.9
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
