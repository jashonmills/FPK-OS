import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download,
  FileSpreadsheet 
} from 'lucide-react';
import { useOrgStudents, CreateOrgStudentData } from '@/hooks/useOrgStudents';
import { useToast } from '@/hooks/use-toast';

interface ImportStudentsCSVProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
}

interface ParsedStudent extends CreateOrgStudentData {
  _rowNumber: number;
  _validationError?: string;
}

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; name: string; error: string }>;
}

export function ImportStudentsCSV({ open, onOpenChange, orgId }: ImportStudentsCSVProps) {
  const { toast } = useToast();
  const { createStudent } = useOrgStudents(orgId);
  
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const downloadTemplate = () => {
    const template = 'full_name,grade_level,student_id,date_of_birth,parent_email,notes\n' +
                     'John Doe,9,ST001,2010-05-15,parent@example.com,Excellent student\n' +
                     'Jane Smith,10,ST002,2009-08-22,parent2@example.com,';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const validateStudent = (student: any, rowNumber: number): ParsedStudent => {
    const validated: ParsedStudent = {
      full_name: student.full_name?.trim() || '',
      grade_level: student.grade_level?.trim() || undefined,
      student_id: student.student_id?.trim() || undefined,
      date_of_birth: student.date_of_birth?.trim() || undefined,
      parent_email: student.parent_email?.trim() || undefined,
      notes: student.notes?.trim() || undefined,
      _rowNumber: rowNumber,
    };

    // Validate required fields
    if (!validated.full_name) {
      validated._validationError = 'Full name is required';
    } else if (validated.full_name.length < 2) {
      validated._validationError = 'Full name must be at least 2 characters';
    }

    // Validate email format if provided
    if (validated.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validated.parent_email)) {
      validated._validationError = 'Invalid email format';
    }

    // Validate date format if provided (YYYY-MM-DD)
    if (validated.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(validated.date_of_birth)) {
      validated._validationError = 'Date must be in YYYY-MM-DD format';
    }

    return validated;
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Parse Error",
            description: "Failed to parse CSV file. Please check the format.",
            variant: "destructive",
          });
          return;
        }

        const validated = results.data.map((row: any, index: number) => 
          validateStudent(row, index + 2) // +2 because row 1 is header
        );

        setParsedData(validated);
        setImportResult(null);
      },
      error: (error) => {
        toast({
          title: "Error",
          description: `Failed to read file: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  }, [toast]);

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);
    
    const validStudents = parsedData.filter(s => !s._validationError);
    const result: ImportResult = {
      total: parsedData.length,
      successful: 0,
      failed: 0,
      errors: [],
    };

    for (let i = 0; i < validStudents.length; i++) {
      const student = validStudents[i];
      const { _rowNumber, _validationError, ...studentData } = student;

      try {
        await new Promise<void>((resolve, reject) => {
          createStudent(studentData, {
            onSuccess: () => {
              result.successful++;
              resolve();
            },
            onError: (error: any) => {
              result.failed++;
              result.errors.push({
                row: _rowNumber,
                name: studentData.full_name,
                error: error.message || 'Failed to create student',
              });
              resolve(); // Continue even on error
            },
          });
        });
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: _rowNumber,
          name: studentData.full_name,
          error: 'Unexpected error',
        });
      }

      setImportProgress(((i + 1) / validStudents.length) * 100);
    }

    // Add validation errors to the result
    const invalidStudents = parsedData.filter(s => s._validationError);
    result.failed += invalidStudents.length;
    invalidStudents.forEach(s => {
      result.errors.push({
        row: s._rowNumber,
        name: s.full_name || 'Unknown',
        error: s._validationError || 'Validation error',
      });
    });

    setImportResult(result);
    setIsImporting(false);

    if (result.successful > 0) {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${result.successful} student${result.successful !== 1 ? 's' : ''}${result.failed > 0 ? ` (${result.failed} failed)` : ''}`,
      });
    }
  };

  const validCount = parsedData.filter(s => !s._validationError).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Students from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with student data. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>

          {/* File Upload */}
          {!parsedData.length && !importResult && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="default" asChild>
                  <span>Select CSV File</span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                or drag and drop your CSV file here
              </p>
            </div>
          )}

          {/* Preview */}
          {parsedData.length > 0 && !importResult && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {parsedData.length} student{parsedData.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {validCount} Valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {invalidCount} Invalid
                    </Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {parsedData.map((student, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b last:border-b-0 ${
                      student._validationError ? 'bg-destructive/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {student.full_name || '(No Name)'}
                          {student._validationError && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.grade_level && `Grade ${student.grade_level}`}
                          {student.student_id && ` • ID: ${student.student_id}`}
                          {student.parent_email && ` • ${student.parent_email}`}
                        </div>
                        {student._validationError && (
                          <div className="text-sm text-destructive mt-1">
                            Row {student._rowNumber}: {student._validationError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {invalidCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {invalidCount} student{invalidCount !== 1 ? 's have' : ' has'} validation errors and will be skipped.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setParsedData([])}
                  disabled={isImporting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={isImporting || validCount === 0}
                  className="flex-1"
                >
                  {isImporting ? 'Importing...' : `Import ${validCount} Student${validCount !== 1 ? 's' : ''}`}
                </Button>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <Progress value={importProgress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Importing students... {Math.round(importProgress)}%
                  </p>
                </div>
              )}
            </>
          )}

          {/* Results */}
          {importResult && (
            <div className="space-y-4">
              <Alert className={importResult.failed > 0 ? "border-orange-500" : ""}>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Import Complete</div>
                  <div className="space-y-1 text-sm">
                    <div>✓ {importResult.successful} successful</div>
                    {importResult.failed > 0 && (
                      <div className="text-destructive">✗ {importResult.failed} failed</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {importResult.errors.length > 0 && (
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  <h4 className="font-semibold mb-2 text-destructive">Errors:</h4>
                  <div className="space-y-2">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Row {error.row}</span> - {error.name}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setParsedData([]);
                  setImportResult(null);
                  onOpenChange(false);
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
