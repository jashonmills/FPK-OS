
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Save, X } from 'lucide-react';

interface ThresholdConfigEditorProps {
  threshold?: {
    id?: string;
    metric_name: string;
    upper_threshold: number;
    lower_threshold: number;
    time_window: string;
    status: string;
    risk_level: string;
    user_segment?: string;
    description?: string;
  };
  userSegments: Array<{ id: string; name: string }>;
  onSave: (threshold: any) => void;
  onCancel: () => void;
}

const ThresholdConfigEditor: React.FC<ThresholdConfigEditorProps> = ({
  threshold,
  userSegments,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    metric_name: threshold?.metric_name || '',
    upper_threshold: threshold?.upper_threshold || 0,
    lower_threshold: threshold?.lower_threshold || 0,
    time_window: threshold?.time_window || '1h',
    status: threshold?.status || 'active',
    risk_level: threshold?.risk_level || 'warning',
    user_segment: threshold?.user_segment || '',
    description: threshold?.description || '',
  });

  const [advancedMode, setAdvancedMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...threshold,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const metricOptions = [
    'reading_session_duration',
    'xp_earned',
    'study_session_accuracy',
    'flashcard_review_time',
    'streak_count',
    'module_completion_time'
  ];

  const timeWindowOptions = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '6h', label: '6 hours' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          {threshold?.id ? 'Edit Threshold Configuration' : 'Create New Threshold'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metric_name">Metric Name</Label>
                <Select
                  value={formData.metric_name}
                  onValueChange={(value) => handleInputChange('metric_name', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map((metric) => (
                      <SelectItem key={metric} value={metric}>
                        {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_window">Time Window</Label>
                <Select
                  value={formData.time_window}
                  onValueChange={(value) => handleInputChange('time_window', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeWindowOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upper_threshold">Upper Threshold</Label>
                <Input
                  id="upper_threshold"
                  type="number"
                  step="0.01"
                  value={formData.upper_threshold}
                  onChange={(e) => handleInputChange('upper_threshold', parseFloat(e.target.value))}
                  placeholder="Upper limit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lower_threshold">Lower Threshold</Label>
                <Input
                  id="lower_threshold"
                  type="number"
                  step="0.01"
                  value={formData.lower_threshold}
                  onChange={(e) => handleInputChange('lower_threshold', parseFloat(e.target.value))}
                  placeholder="Lower limit"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Alert Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Alert Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="risk_level">Risk Level</Label>
                <Select
                  value={formData.risk_level}
                  onValueChange={(value) => handleInputChange('risk_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_segment">User Segment</Label>
                <Select
                  value={formData.user_segment}
                  onValueChange={(value) => handleInputChange('user_segment', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Users</SelectItem>
                    {userSegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={advancedMode}
                onCheckedChange={setAdvancedMode}
              />
              <Label>Advanced Options</Label>
            </div>

            {advancedMode && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Optional description for this threshold configuration"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ThresholdConfigEditor;
