import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface SendBetaUpdateProps {
  trigger?: React.ReactNode;
}

const SendBetaUpdate: React.FC<SendBetaUpdateProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const handleSend = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      logger.info('Sending beta update', 'ADMIN', { formData });
      
      const { data, error } = await supabase.functions.invoke('broadcast-beta-update', {
        body: formData
      });

      if (error) throw error;

      logger.info('Update sent successfully', 'ADMIN', { data });
      toast.success(`Update sent to ${data.users_notified} beta users!`);
      
      setFormData({ title: '', message: '', type: 'info' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending update:', error);
      toast.error('Failed to send update. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="w-full">
      <Send className="w-4 h-4 mr-2" />
      Send Update to Beta Users
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Update to Beta Users</DialogTitle>
          <DialogDescription>
            Broadcast a real-time message to all active beta users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Update Title</label>
            <Input
              placeholder="e.g., New Feature Available"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Update Type</label>
            <Select value={formData.type} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="feature">New Feature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="What would you like to tell your beta users?"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              disabled={isLoading || !formData.title.trim() || !formData.message.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Update
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendBetaUpdate;