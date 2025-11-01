import { supabase } from '@/integrations/supabase/client';

// Map of course image files to upload
const courseImages = [
  'empowering-handwriting-bg.jpg',
  'el-handwriting-bg.jpg',
  'empowering-numeracy-bg.jpg',
  'empowering-reading-bg.jpg',
  'empowering-spelling-new-bg.jpg',
  'learning-state-course-bg.jpg',
  'linear-equations-unique-bg.jpg',
  'trigonometry-background.jpg',
  'linear-equations-background.jpg',
  'logic-background.jpg',
  'economics-background.jpg',
  'neurodiversity-background.jpg',
  'money-management-background.jpg',
  'interactive-geometry-fundamentals-bg.jpg',
  'elt-background-generated.jpg',
  'science-background-generated.jpg',
  'creative-writing-bg.jpg',
  'drawing-sketching-bg.jpg',
  'philosophy-bg.jpg'
];

export async function uploadAllCourseImages() {
  const results = {
    success: [] as string[],
    failed: [] as { file: string; error: string }[]
  };

  console.log('Starting upload of', courseImages.length, 'course images...');

  for (const filename of courseImages) {
    try {
      // Fetch the image from the repo's storage directory
      const imagePath = `/supabase/storage/course-images/${filename}`;
      const response = await fetch(imagePath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('course-images')
        .upload(filename, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type
        });

      if (error) {
        console.error(`Error uploading ${filename}:`, error);
        results.failed.push({ file: filename, error: error.message });
      } else {
        console.log(`✓ Successfully uploaded ${filename}`);
        results.success.push(filename);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error processing ${filename}:`, errorMessage);
      results.failed.push({ file: filename, error: errorMessage });
    }
  }

  console.log('\n=== Upload Summary ===');
  console.log(`✓ Successful: ${results.success.length}/${courseImages.length}`);
  console.log(`✗ Failed: ${results.failed.length}/${courseImages.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed uploads:');
    results.failed.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  return results;
}
