import React, { useState, useEffect } from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Calendar, User, Clock } from 'lucide-react';

const LOG_TYPES = [
  { value: 'therapy', label: 'Therapy Session' },
  { value: 'classroom', label: 'Classroom Observation' },
  { value: 'observation', label: 'General Observation' },
  { value: 'behavior', label: 'Behavioral Incident' },
];

export const EducatorLogsSection = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    log_type: 'therapy',
    educator_name: '',
    educator_role: '',
    session_duration_minutes: '',
    progress_notes: '',
    behavioral_observations: '',
    challenges: '',
    goals_for_next_session: '',
  });

  useEffect(() => {
    if (selectedFamily && selectedStudent) {
      loadLogs();
    }
  }, [selectedFamily, selectedStudent]);

  const loadLogs = async () => {
    if (!selectedFamily || !selectedStudent) return;

    const { data, error } = await supabase
      .from('educator_logs')
      .select('*')
      .eq('family_id', selectedFamily.id)
      .eq('student_id', selectedStudent.id)
      .order('log_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading logs:', error);
    } else {
      setLogs(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFamily || !selectedStudent || !user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('educator_logs').insert({
        family_id: selectedFamily.id,
        student_id: selectedStudent.id,
        created_by: user.id,
        ...formData,
        session_duration_minutes: formData.session_duration_minutes
          ? parseInt(formData.session_duration_minutes)
          : null,
      });

      if (error) throw error;

      toast.success('Log added successfully');
      setIsDialogOpen(false);
      loadLogs();

      // Reset form
      setFormData({
        log_date: new Date().toISOString().split('T')[0],
        log_type: 'therapy',
        educator_name: '',
        educator_role: '',
        session_duration_minutes: '',
        progress_notes: '',
        behavioral_observations: '',
        challenges: '',
        goals_for_next_session: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Educator Logs</h2>
          <p className="text-muted-foreground">Track therapy sessions and daily observations</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Log
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Educator Log</DialogTitle>
              <DialogDescription>
                Record a therapy session or observation for {selectedStudent?.student_name}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="log_date">Date</Label>
                  <Input
                    id="log_date"
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log_type">Log Type</Label>
                  <Select
                    value={formData.log_type}
                    onValueChange={(value) => setFormData({ ...formData, log_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOG_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educator_name">Your Name</Label>
                  <Input
                    id="educator_name"
                    placeholder="e.g., Sarah Johnson"
                    value={formData.educator_name}
                    onChange={(e) => setFormData({ ...formData, educator_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educator_role">Your Role</Label>
                  <Input
                    id="educator_role"
                    placeholder="e.g., ABA Therapist"
                    value={formData.educator_role}
                    onChange={(e) => setFormData({ ...formData, educator_role: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_duration">Session Duration (minutes)</Label>
                <Input
                  id="session_duration"
                  type="number"
                  placeholder="60"
                  value={formData.session_duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, session_duration_minutes: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress_notes">Progress Notes</Label>
                <Textarea
                  id="progress_notes"
                  placeholder="Describe progress made during this session..."
                  value={formData.progress_notes}
                  onChange={(e) => setFormData({ ...formData, progress_notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavioral_observations">Behavioral Observations</Label>
                <Textarea
                  id="behavioral_observations"
                  placeholder="Note any behavioral observations..."
                  value={formData.behavioral_observations}
                  onChange={(e) =>
                    setFormData({ ...formData, behavioral_observations: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="Any challenges or areas of concern..."
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals for Next Session</Label>
                <Textarea
                  id="goals"
                  placeholder="What to focus on next time..."
                  value={formData.goals_for_next_session}
                  onChange={(e) =>
                    setFormData({ ...formData, goals_for_next_session: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Log'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logs List */}
      <div className="grid gap-4">
        {logs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No logs yet. Click "Add Log" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {LOG_TYPES.find((t) => t.value === log.log_type)?.label || log.log_type}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.log_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.educator_name}
                      </span>
                      {log.session_duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.session_duration_minutes} min
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {log.progress_notes && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Progress Notes</h4>
                    <p className="text-sm text-muted-foreground">{log.progress_notes}</p>
                  </div>
                )}
                {log.behavioral_observations && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Behavioral Observations</h4>
                    <p className="text-sm text-muted-foreground">{log.behavioral_observations}</p>
                  </div>
                )}
                {log.challenges && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Challenges</h4>
                    <p className="text-sm text-muted-foreground">{log.challenges}</p>
                  </div>
                )}
                {log.goals_for_next_session && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Goals for Next Session</h4>
                    <p className="text-sm text-muted-foreground">{log.goals_for_next_session}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
