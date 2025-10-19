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
    <div className="mobile-stack">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto min-h-[44px]">
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
        <CardHeader className="mobile-card-padding">
          <CardTitle className="mobile-heading-md">All Partners</CardTitle>
        </CardHeader>
        <CardContent className="mobile-card-padding pt-0">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">Logo</TableHead>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Display Section</TableHead>
                    <TableHead className="hidden sm:table-cell">Website</TableHead>
                    <TableHead className="hidden xl:table-cell">Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right sticky right-0 bg-card">Actions</TableHead>
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
                           className="h-8 w-16 sm:h-10 sm:w-20 object-contain"
                           onError={(e) => {
                             e.currentTarget.src = 'https://via.placeholder.com/80x40?text=Logo';
                           }}
                         />
                       </TableCell>
                       <TableCell className="font-medium text-sm">{partner.name}</TableCell>
                       <TableCell className="hidden md:table-cell text-sm">{partner.category}</TableCell>
                       <TableCell className="hidden lg:table-cell">
                         <span className="text-xs whitespace-nowrap">
                           {partner.display_section === 'trusted_partners' 
                             ? 'Trusted Partners' 
                             : 'Further Reading'}
                         </span>
                       </TableCell>
                       <TableCell className="hidden sm:table-cell">
                         <a 
                           href={partner.website_url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-primary hover:underline flex items-center gap-1 text-sm"
                         >
                           Visit
                           <ExternalLink className="h-3 w-3" />
                         </a>
                       </TableCell>
                       <TableCell className="hidden xl:table-cell text-sm">{partner.display_order}</TableCell>
                       <TableCell>
                         <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                           partner.is_active 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-gray-100 text-gray-800'
                         }`}>
                           {partner.is_active ? 'Active' : 'Inactive'}
                         </span>
                       </TableCell>
                       <TableCell className="text-right sticky right-0 bg-card">
                         <div className="flex items-center justify-end gap-1">
                           <Button
                             size="sm"
                             variant="outline"
                             className="h-8 w-8 p-0"
                             onClick={() => handleEdit(partner)}
                           >
                             <Pencil className="h-4 w-4" />
                           </Button>
                           <Button
                             size="sm"
                             variant="destructive"
                             className="h-8 w-8 p-0"
                             onClick={() => handleDelete(partner.id, partner.name)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                       No partners found. Click "Add New Partner" to get started.
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
            </div>
           )}
         </CardContent>
       </Card>
    </div>
  );
}
