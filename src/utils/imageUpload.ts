import { supabase } from '@/integrations/supabase/client';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions
        const maxDim = 1200;
        if (width > height && width > maxDim) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else if (height > maxDim) {
          width = (width * maxDim) / height;
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const uploadLogImages = async (
  files: File[],
  logId: string,
  logType: string,
  familyId: string,
  studentId: string
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.warn(`Skipping invalid file type: ${file.type}`);
      continue;
    }

    let fileToUpload = file;
    if (file.size > MAX_FILE_SIZE) {
      fileToUpload = await compressImage(file);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${logType}/${familyId}/${studentId}/${logId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('log-images')
      .upload(filePath, fileToUpload);

    if (error) {
      console.error('Upload error:', error);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('log-images')
      .getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
};

export const deleteLogImages = async (urls: string[]): Promise<void> => {
  const paths = urls.map(url => {
    const parts = url.split('/log-images/');
    return parts[1];
  });

  const { error } = await supabase.storage
    .from('log-images')
    .remove(paths);

  if (error) {
    console.error('Delete error:', error);
  }
};
