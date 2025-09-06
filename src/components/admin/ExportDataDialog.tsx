import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Database } from 'lucide-react';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import type { Organization } from '@/types/organization';

interface ExportDataDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const exportSchema = z.object({
  export_type: z.enum(['members', 'activity', 'usage', 'complete']),
  format: z.enum(['csv', 'json']),
  include_deleted: z.boolean().default(false),
  date_range: z.enum(['30_days', '90_days', '1_year', 'all_time']).default('90_days'),
});

type ExportFormData = z.infer<typeof exportSchema>;

export function ExportDataDialog({ organization, open, onOpenChange }: ExportDataDialogProps) {
  const { exportData } = useOrganizationActions();
  
  const form = useForm<ExportFormData>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      export_type: 'members',
      format: 'csv',
      include_deleted: false,
      date_range: '90_days',
    },
  });

  const onSubmit = async (data: ExportFormData) => {
    try {
      await exportData.mutateAsync({
        organizationId: organization.id,
        data: {
          export_type: data.export_type,
          format: data.format,
        }
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const exportTypeOptions = [
    { value: 'members', label: 'Members Data', description: 'User profiles, roles, and membership details' },
    { value: 'activity', label: 'Activity Logs', description: 'Login history, course progress, and user actions' },
    { value: 'usage', label: 'Usage Statistics', description: 'Feature usage, billing data, and analytics' },
    { value: 'complete', label: 'Complete Export', description: 'All organization data (may take longer)' },
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Spreadsheet-friendly format' },
    { value: 'json', label: 'JSON', icon: Database, description: 'Structured data format' },
  ];

  const dateRangeOptions = [
    { value: '30_days', label: 'Last 30 days' },
    { value: '90_days', label: 'Last 90 days' },
    { value: '1_year', label: 'Last year' },
    { value: 'all_time', label: 'All time' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Download className="h-5 w-5" />
            Export Organization Data
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate and download organization data exports. You'll receive a download link via email when ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Organization: {organization.name}</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Members: {organization.seats_used} / {organization.seat_limit}</p>
                  <p>Created: {new Date(organization.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="export_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Data Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select data type to export" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border border-border">
                        {exportTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="hover:bg-muted">
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border text-foreground">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border">
                          {formatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="hover:bg-muted">
                              <div className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Date Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border text-foreground">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border border-border">
                          {dateRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="hover:bg-muted">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="include_deleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-foreground cursor-pointer">
                        Include deleted records
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Include members and data that have been marked as deleted
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-info/20 bg-info/5 p-4">
                <h4 className="font-medium text-info mb-2">Privacy & Security:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All exports are encrypted and password-protected</li>
                  <li>• Download links expire after 7 days</li>
                  <li>• Sensitive data is redacted according to privacy policies</li>
                  <li>• Export activity is logged for audit purposes</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-border text-muted-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={exportData.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {exportData.isPending ? 'Preparing Export...' : 'Generate Export'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}