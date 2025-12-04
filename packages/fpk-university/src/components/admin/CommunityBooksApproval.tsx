
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminBookApproval } from '@/hooks/useAdminBookApproval';
import { Users, Check, X, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CommunityBooksApproval: React.FC = () => {
  const {
    pendingBooks,
    isLoading,
    approveBook,
    rejectBook,
    bulkApprove,
    bulkReject,
    isApproving,
    isRejecting,
    isBulkApproving,
    isBulkRejecting,
  } = useAdminBookApproval();

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [rejectNotes, setRejectNotes] = useState('');
  const [bulkRejectNotes, setBulkRejectNotes] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileName = (fileName: string) => {
    return fileName.length > 40 ? fileName.substring(0, 40) + '...' : fileName;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBooks(pendingBooks.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId: string, checked: boolean) => {
    if (checked) {
      setSelectedBooks(prev => [...prev, bookId]);
    } else {
      setSelectedBooks(prev => prev.filter(id => id !== bookId));
    }
  };

  const handleApprove = (bookId: string) => {
    approveBook(bookId);
  };

  const handleReject = (bookId: string) => {
    rejectBook({ bookId, notes: rejectNotes });
    setRejectNotes('');
  };

  const handleBulkApprove = () => {
    if (selectedBooks.length === 0) return;
    bulkApprove(selectedBooks);
    setSelectedBooks([]);
  };

  const handleBulkReject = () => {
    if (selectedBooks.length === 0) return;
    bulkReject({ bookIds: selectedBooks, notes: bulkRejectNotes });
    setSelectedBooks([]);
    setBulkRejectNotes('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Books Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="community-books-approval">
        <Card>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <CardTitle className="flex items-center gap-2 text-left">
              <Users className="h-5 w-5" />
              Community Books Approval
              {pendingBooks.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingBooks.length} pending
                </Badge>
              )}
            </CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="pt-0">
              {pendingBooks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No pending community books to review at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bulk Actions */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedBooks.length === pendingBooks.length && pendingBooks.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all books"
                      />
                      <span className="text-sm font-medium">
                        {selectedBooks.length} of {pendingBooks.length} selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleBulkApprove}
                        disabled={selectedBooks.length === 0 || isBulkApproving}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve Selected
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={selectedBooks.length === 0 || isBulkRejecting}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject Selected
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Selected Books</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject {selectedBooks.length} selected book(s)?
                              You can optionally provide a reason below.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label htmlFor="bulk-reject-notes">Rejection reason (optional)</Label>
                            <Input
                              id="bulk-reject-notes"
                              value={bulkRejectNotes}
                              onChange={(e) => setBulkRejectNotes(e.target.value)}
                              placeholder="Enter reason for rejection..."
                              className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleBulkReject}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Reject Books
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Books Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Uploaded At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingBooks.map((book) => (
                          <TableRow key={book.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedBooks.includes(book.id)}
                                onCheckedChange={(checked) => handleSelectBook(book.id, checked as boolean)}
                                aria-label={`Select ${book.file_name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatFileName(book.file_name)}
                            </TableCell>
                            <TableCell>{book.uploader_email}</TableCell>
                            <TableCell>{formatDate(book.uploaded_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(book.id)}
                                  disabled={isApproving}
                                  className="flex items-center gap-1"
                                  aria-label={`Approve ${book.file_name}`}
                                >
                                  <Check className="h-3 w-3" />
                                  Approve
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={isRejecting}
                                      className="flex items-center gap-1"
                                      aria-label={`Reject ${book.file_name}`}
                                    >
                                      <X className="h-3 w-3" />
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Book</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject "{formatFileName(book.file_name)}"?
                                        You can optionally provide a reason below.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-4">
                                      <Label htmlFor="reject-notes">Rejection reason (optional)</Label>
                                      <Input
                                        id="reject-notes"
                                        value={rejectNotes}
                                        onChange={(e) => setRejectNotes(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                        className="mt-2"
                                      />
                                    </div>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleReject(book.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Reject Book
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

export default CommunityBooksApproval;
