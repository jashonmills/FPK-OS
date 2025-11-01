import { uploadAllCourseImages } from './uploadAllCourseImages';

export async function uploadCourseImages() {
  try {
    console.log('Starting course image upload process...');
    const results = await uploadAllCourseImages();
    
    console.log('Upload completed:', results);
    return results;
  } catch (error) {
    console.error('Error uploading course images:', error);
    throw error;
  }
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).uploadCourseImages = uploadCourseImages;
  (window as any).uploadAllCourseImages = uploadAllCourseImages;
}