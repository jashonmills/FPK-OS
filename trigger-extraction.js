// Temporary script to trigger SCORM package re-extraction
// This will call the new production-ready extraction function

const SUPABASE_URL = "https://zgcegkmqfgznbpdplscz.supabase.co";

async function triggerExtraction() {
  try {
    console.log('🚀 Triggering SCORM package re-extraction...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/scorm-extract-package`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}` // You'll need to provide this
      },
      body: JSON.stringify({
        packageId: '5b9cf247-af05-41cc-b849-a8d86cc07b51',
        zipBucket: 'scorm-packages', // Where the ZIP is stored
        zipPath: '1756749279284_algebra_full_scorm_8 (1).zip',
        targetBucket: 'scorm-unpacked', // Where extracted files will go
        clean: true // Clean existing extracted content first
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Extraction successful:', result);
      console.log(`📁 Extracted ${result.filesWritten} files`);
      console.log(`💾 Total bytes: ${result.bytesWritten}`);
      console.log(`📍 Extract path: ${result.extractPath}`);
      if (result.skipped.length > 0) {
        console.log('⚠️ Skipped files:', result.skipped);
      }
    } else {
      console.error('❌ Extraction failed:', result);
    }
    
    return result;
  } catch (error) {
    console.error('🚨 Error triggering extraction:', error);
    throw error;
  }
}

function getAuthToken() {
  // In a real scenario, you would get this from your auth context
  // For testing, you can manually provide a valid token
  console.log('⚠️ Please provide a valid auth token');
  return 'your-auth-token-here';
}

// Call the function
triggerExtraction().catch(console.error);