import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Upload, Trash2, FileText, File, Plus, AlertCircle, Download } from 'lucide-react';
import { useOrgKnowledgeBase } from '@/hooks/useOrgKnowledgeBase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { PlatformAdminOrgSelector } from './PlatformAdminOrgSelector';

const AIGovernanceKnowledgeBase: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', content: '', fileName: '' });

  const { documents, isLoading, addDocument, deleteDocument, toggleDocument } = useOrgKnowledgeBase(selectedOrgId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setNewDoc({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content,
          fileName: file.name,
        });
        toast.success(`File "${file.name}" loaded successfully`);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file. Please try pasting the content manually.');
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleDownloadDocument = (doc: { title: string; content: string; file_name: string; file_type: string }) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name || `${doc.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document downloaded');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
  });

  const handleAddDocument = async () => {
    if (!selectedOrgId || !newDoc.title || !newDoc.content) return;

    const fileType = newDoc.fileName.split('.').pop() || 'txt';
    
    await addDocument.mutateAsync({
      title: newDoc.title,
      fileName: newDoc.fileName || `${newDoc.title}.txt`,
      fileType,
      content: newDoc.content,
      orgId: selectedOrgId,
    });

    setNewDoc({ title: '', content: '', fileName: '' });
    setIsAddDialogOpen(false);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'md':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <PlatformAdminOrgSelector
        selectedOrgId={selectedOrgId}
        onOrgChange={setSelectedOrgId}
      />

      {!selectedOrgId ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Organization Knowledge Base
            </CardTitle>
            <CardDescription>
              Select an organization above to manage the knowledge base.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Organization Knowledge Base
                </CardTitle>
                <CardDescription>
                  Upload documents that AI tools will use as context when answering questions.
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Add Document to Knowledge Base</DialogTitle>
                    <DialogDescription>
                      Upload a text file or paste content directly.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 py-2">
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        {isDragActive ? (
                          <p className="text-sm">Drop the file here...</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Drag & drop a .txt or .md file, or click to select
                          </p>
                        )}
                      </div>

                      <div className="text-center text-xs text-muted-foreground">— or paste content directly —</div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                          id="title"
                          value={newDoc.title}
                          onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Student Handbook, AI Policy"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newDoc.content}
                          onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Paste document content here..."
                          rows={6}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          {newDoc.content.length} characters • ~{Math.ceil(newDoc.content.length / 500)} chunks
                        </p>
                      </div>
                    </div>
                  </ScrollArea>

                  <DialogFooter className="pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleAddDocument}
                      disabled={!newDoc.title || !newDoc.content || addDocument.isPending}
                    >
                      {addDocument.isPending ? 'Adding...' : 'Add Document'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-500">How Knowledge Base Works</p>
                  <p className="text-muted-foreground">
                    Documents are automatically chunked and injected as context when using AI tools like 
                    Lesson Planner, Quiz Generator, and Research Assistant. This makes AI responses 
                    aware of your organization's specific policies, curriculum, and guidelines.
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents in knowledge base yet.</p>
                <p className="text-sm">Add documents to make AI tools context-aware.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {doc.title}
                          {doc.is_active ? (
                            <Badge variant="default" className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.file_name} • {doc.content.length.toLocaleString()} chars • {doc.content_chunks.length} chunks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={doc.is_active}
                        onCheckedChange={(checked) => toggleDocument.mutate({ id: doc.id, isActive: checked })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Download document"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDocument.mutate(doc.id)}
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIGovernanceKnowledgeBase;
