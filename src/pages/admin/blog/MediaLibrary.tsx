import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Search, Image as ImageIcon, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { TransparentTile } from '@/components/ui/transparent-tile';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
}

export default function MediaLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

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
    <div className="px-6 pt-12 pb-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/admin/blog')} className="bg-background/50 backdrop-blur-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog Hub
      </Button>
      
      <TransparentTile className="p-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          Media Library
        </h1>
        <p className="text-muted-foreground mt-1">Manage your blog images</p>
      </TransparentTile>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
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
          <Card key={file.id} className="overflow-hidden group relative bg-background/80 backdrop-blur-sm">
            <img
              src={getPublicUrl(file.name)}
              alt={file.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(getPublicUrl(file.name));
                    toast.success('URL copied!');
                  }}
                >
                  Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(file.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
