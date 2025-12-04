import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';

interface UserRate {
  id: string;
  user_id: string;
  hourly_rate: number;
  currency: string;
  effective_date: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export const UserRatesTable = () => {
  const [rates, setRates] = useState<UserRate[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRate, setEditingRate] = useState<UserRate | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    hourly_rate: '',
    effective_date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('user_rates')
        .select('*')
        .order('effective_date', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = data?.map(r => r.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const ratesWithProfiles = data?.map(rate => ({
        ...rate,
        profiles: profiles?.find(p => p.id === rate.user_id) || null,
      })) || [];

      setRates(ratesWithProfiles as any);
    } catch (error: any) {
      console.error('Error fetching rates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user rates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRate) {
        const { error } = await supabase
          .from('user_rates')
          .update({
            hourly_rate: parseFloat(formData.hourly_rate),
            effective_date: formData.effective_date,
          })
          .eq('id', editingRate.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Rate updated successfully' });
      } else {
        const { error } = await supabase
          .from('user_rates')
          .insert({
            user_id: formData.user_id,
            hourly_rate: parseFloat(formData.hourly_rate),
            effective_date: formData.effective_date,
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Rate added successfully' });
      }

      setShowDialog(false);
      setEditingRate(null);
      setFormData({ user_id: '', hourly_rate: '', effective_date: new Date().toISOString().split('T')[0] });
      fetchRates();
    } catch (error: any) {
      console.error('Error saving rate:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save rate',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (rate: UserRate) => {
    setEditingRate(rate);
    setFormData({
      user_id: rate.user_id,
      hourly_rate: rate.hourly_rate.toString(),
      effective_date: rate.effective_date,
    });
    setShowDialog(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">User Hourly Rates</h3>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hourly Rate</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No rates configured
                </TableCell>
              </TableRow>
            ) : (
              rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.profiles?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{rate.profiles?.email || 'N/A'}</TableCell>
                  <TableCell>${rate.hourly_rate.toFixed(2)} {rate.currency}</TableCell>
                  <TableCell>{new Date(rate.effective_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(rate)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRate ? 'Edit' : 'Add'} User Rate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingRate && (
              <div>
                <label className="text-sm font-medium">User</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Effective Date</label>
              <Input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingRate ? 'Update' : 'Add'} Rate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
