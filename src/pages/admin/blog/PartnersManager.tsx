import { useState } from 'react';
import { useAllPartnerResources, useCreatePartner, useUpdatePartner, useDeletePartner, PartnerResource } from '@/hooks/usePartnerResources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobilePartnerCard } from '@/components/admin/MobilePartnerCard';

const CATEGORIES = [
  'Sensory Tools',
  'Assistive Technology',
  'Educational Games',
  'Study Resources',
  'Mental Health Tools',
  'Physical Learning Aids',
  'General'
];

interface PartnerFormData {
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  website_url: string;
  category: string;
  display_section: 'trusted_partners' | 'recommended_organizations';
  display_order: number;
  is_active: boolean;
}

export function PartnersManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerResource | null>(null);
  const isMobile = useIsMobile();
  
  const { data: partners, isLoading } = useAllPartnerResources();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();

  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    tagline: '',
    description: '',
    logo_url: '',
    website_url: 'https://',
    category: 'General',
    display_section: 'recommended_organizations',
    display_order: 0,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      description: '',
      logo_url: '',
      website_url: 'https://',
      category: 'General',
      display_section: 'recommended_organizations',
      display_order: 0,
      is_active: true
    });
    setEditingPartner(null);
  };

  const handleEdit = (partner: PartnerResource) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      tagline: partner.tagline,
      description: partner.description,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
      category: partner.category,
      display_section: partner.display_section,
      display_order: partner.display_order,
      is_active: partner.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        await updatePartner.mutateAsync({ id: editingPartner.id, ...formData });
        toast({
          title: 'Success',
          description: 'Partner updated successfully'
        });
      } else {
        await createPartner.mutateAsync(formData);
        toast({
          title: 'Success',
          description: 'Partner created successfully'
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save partner',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await deletePartner.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Partner deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete partner',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline * (Max 100 characters)</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description * (Max 300 characters)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={300}
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/300 characters
                </p>
              </div>

              <div>
                <Label htmlFor="logo_url">Logo URL *</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website_url">Website URL *</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_section">Display Section *</Label>
                <Select
                  value={formData.display_section}
                  onValueChange={(value: 'trusted_partners' | 'recommended_organizations') => 
                    setFormData({ ...formData, display_section: value })
                  }
                >
                  <SelectTrigger id="display_section">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trusted_partners">Trusted Partners & Recommended Tools</SelectItem>
                    <SelectItem value="recommended_organizations">Further Reading & Recommended Organizations</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose where this partner will appear on the Resources page
                </p>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active (Visible on Resources page)</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPartner.isPending || updatePartner.isPending}>
                  {editingPartner ? 'Update Partner' : 'Create Partner'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-semibold">All Partners</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : isMobile ? (
            /* Mobile Card View */
            <div className="space-y-3">
              {partners && partners.length > 0 ? (
                partners.map(partner => (
                  <MobilePartnerCard
                    key={partner.id}
                    partner={partner}
                    onEdit={() => handleEdit(partner)}
                    onDelete={() => handleDelete(partner.id, partner.name)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No partners found. Click "Add New Partner" to get started.
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px]">Logo</TableHead>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[100px]">Category</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[100px]">Section</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[80px]">Website</TableHead>
                      <TableHead className="hidden xl:table-cell min-w-[60px]">Order</TableHead>
                      <TableHead className="min-w-[70px]">Status</TableHead>
                      <TableHead className="text-right sticky right-0 bg-card/95 backdrop-blur-sm min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners && partners.length > 0 ? (
                      partners.map(partner => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <img
                              src={partner.logo_url}
                              alt={`${partner.name} logo`}
                              className="h-6 w-12 sm:h-8 sm:w-16 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/80x40?text=Logo';
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">{partner.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">{partner.category}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-xs whitespace-nowrap">
                              {partner.display_section === 'trusted_partners' 
                                ? 'Partners' 
                                : 'Reading'}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <a 
                              href={partner.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-xs"
                            >
                              Visit
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs">{partner.display_order}</TableCell>
                          <TableCell>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap ${
                              partner.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {partner.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right sticky right-0 bg-card/95 backdrop-blur-sm">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEdit(partner)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(partner.id, partner.name)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs sm:text-sm">
                          No partners found. Click "Add New Partner" to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
         </CardContent>
       </Card>
    </div>
  );
}
