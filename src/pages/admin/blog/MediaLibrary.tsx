import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Image as ImageIcon, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { MediaAssetDialog } from '@/components/blog/MediaAssetDialog';
import { useMediaAsset } from '@/hooks/useMediaAssets';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);

  const { data: files, refetch } = useQuery({
    queryKey: ['blog-media'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      return data;
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file);
        
        if (error) throw error;
      }
      toast.success('Files uploaded successfully');
      refetch();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  });

  const handleDelete = async (fileName: string) => {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName]);
    
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Image deleted');
      refetch();
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors bg-background/80 backdrop-blur-sm
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">
          {uploading ? 'Uploading...' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to browse (PNG, JPG, JPEG, GIF, WEBP)
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/80 backdrop-blur-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredFiles?.map((file) => (
          <MediaCard
            key={file.id}
            fileName={file.name}
            publicUrl={getPublicUrl(file.name)}
            onDelete={() => handleDelete(file.name)}
            onClick={() => setSelectedFile({ name: file.name, url: getPublicUrl(file.name) })}
          />
        ))}
      </div>

      {selectedFile && (
        <MediaAssetDialog
          open={!!selectedFile}
          onOpenChange={(open) => !open && setSelectedFile(null)}
          storagePath={selectedFile.name}
          publicUrl={selectedFile.url}
        />
      )}
    </div>
  );
}

interface MediaCardProps {
  fileName: string;
  publicUrl: string;
  onDelete: () => void;
  onClick: () => void;
}

function MediaCard({ fileName, publicUrl, onDelete, onClick }: MediaCardProps) {
  const { data: asset } = useMediaAsset(fileName);
  const hasMetadata = !!(asset?.title || asset?.alt_text || asset?.description);

  return (
    <Card className="overflow-hidden group relative bg-background/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={onClick}>
        {hasMetadata && (
          <Badge variant="secondary" className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Metadata
          </Badge>
        )}
        <img
          src={publicUrl}
          alt={asset?.alt_text || fileName}
          className="w-full h-48 object-cover"
        />
        <div className="p-3 space-y-2">
          <p className="text-sm font-medium truncate">{asset?.title || fileName}</p>
          {asset?.asset_type && asset.asset_type !== 'general' && (
            <Badge variant="outline" className="text-xs">
              {asset.asset_type.replace(/_/g, ' ')}
            </Badge>
          )}
        </div>
      </div>
      <div className="px-3 pb-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(publicUrl);
            toast.success('URL copied!');
          }}
        >
          Copy URL
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
