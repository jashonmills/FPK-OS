import React from 'react';

interface ImageSectionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
}

export const ImageSection: React.FC<ImageSectionProps> = ({ 
  src, 
  alt, 
  caption, 
  width, 
  height 
}) => {
  return (
    <figure className="my-6">
      <div className="flex justify-center">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg border shadow-sm max-w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
