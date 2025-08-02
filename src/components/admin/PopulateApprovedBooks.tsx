
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, CheckCircle } from 'lucide-react';

const PopulateApprovedBooks: React.FC = () => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [populatedCount, setPopulatedCount] = useState(0);
  const { toast } = useToast();

  const populateApprovedBooks = async () => {
    setIsPopulating(true);
    setPopulatedCount(0);

    try {
      console.log('📚 Starting to populate approved books from storage...');

      // Get all files from the library-book-pdf bucket
      const { data: files, error: listError } = await supabase.storage
        .from('library-book-pdf')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Error listing storage files:', listError);
        throw listError;
      }

      console.log(`📂 Found ${files?.length || 0} files in storage`);

      if (!files || files.length === 0) {
        toast({
          title: "No files found",
          description: "No PDF files found in storage bucket.",
          variant: "destructive"
        });
        return;
      }

      // Filter only PDF files
      const pdfFiles = files.filter(file => 
        file.name.toLowerCase().endsWith('.pdf') && file.metadata
      );

      console.log(`📄 Found ${pdfFiles.length} PDF files`);

      let successCount = 0;
      const adminUserId = (await supabase.auth.getUser()).data.user?.id;

      for (const file of pdfFiles) {
        try {
          // Get the public URL for the file
          const { data: { publicUrl } } = supabase.storage
            .from('library-book-pdf')
            .getPublicUrl(file.name);

          // Check if this file already exists in the database
          const { data: existingBook } = await supabase
            .from('user_uploaded_books')
            .select('id')
            .eq('file_name', file.name)
            .single();

          if (existingBook) {
            console.log(`📖 Book ${file.name} already exists in database, skipping...`);
            continue;
          }

          // Insert the book as approved
          const { error: insertError } = await supabase
            .from('user_uploaded_books')
            .insert({
              user_id: adminUserId || '00000000-0000-0000-0000-000000000000',
              file_name: file.name,
              file_url: publicUrl,
              status: 'approved',
              reviewed_by: adminUserId,
              reviewed_at: new Date().toISOString(),
              notes: 'Auto-populated from existing storage files'
            });

          if (insertError) {
            console.error(`Error inserting ${file.name}:`, insertError);
          } else {
            successCount++;
            setPopulatedCount(successCount);
            console.log(`✅ Added ${file.name} to approved books`);
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
        }
      }

      toast({
        title: "Books populated successfully",
        description: `Added ${successCount} books to the approved community collection.`,
      });

      console.log(`🎉 Successfully populated ${successCount} approved books`);

    } catch (error) {
      console.error('Error populating books:', error);
      toast({
        title: "Error populating books",
        description: "Failed to populate books from storage. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Populate Community Books
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Import all PDF files from storage as approved community books
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Import Storage Files</p>
            <p className="text-xs text-muted-foreground">
              This will add all PDFs from the library-book-pdf bucket as approved books
            </p>
          </div>
          <Button 
            onClick={populateApprovedBooks}
            disabled={isPopulating}
            className="flex items-center gap-2"
          >
            {isPopulating ? (
              <>
                <Upload className="h-4 w-4 animate-spin" />
                Populating... ({populatedCount})
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Populate Books
              </>
            )}
          </Button>
        </div>
        
        {isPopulating && (
          <div className="text-sm text-muted-foreground">
            Processed {populatedCount} books so far...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PopulateApprovedBooks;
