
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  user_count: number;
  created_at: string;
}

interface UserSegmentManagerProps {
  segments: UserSegment[];
  onCreateSegment: (segment: Omit<UserSegment, 'id' | 'user_count' | 'created_at'>) => void;
}

const UserSegmentManager: React.FC<UserSegmentManagerProps> = ({
  segments,
  onCreateSegment
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {
      xp_range: { min: 0, max: 1000 },
      activity_level: 'all',
      enrollment_date_range: 'all',
      learning_style: 'all'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSegment(formData);
    setFormData({
      name: '',
      description: '',
      criteria: {
        xp_range: { min: 0, max: 1000 },
        activity_level: 'all',
        enrollment_date_range: 'all',
        learning_style: 'all'
      }
    });
    setShowCreateForm(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriteriaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: value
      }
    }));
  };

  const getCriteriaDescription = (criteria: Record<string, any>) => {
    const descriptions = [];
    
    if (criteria.xp_range && criteria.xp_range.min !== 0 || criteria.xp_range.max !== 1000) {
      descriptions.push(`XP: ${criteria.xp_range.min}-${criteria.xp_range.max}`);
    }
    
    if (criteria.activity_level && criteria.activity_level !== 'all') {
      descriptions.push(`Activity: ${criteria.activity_level}`);
    }
    
    if (criteria.learning_style && criteria.learning_style !== 'all') {
      descriptions.push(`Style: ${criteria.learning_style}`);
    }

    return descriptions.length > 0 ? descriptions.join(', ') : 'No specific criteria';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Segments</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Create New User Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Segment Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., High Performers"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  <Select
                    value={formData.criteria.activity_level}
                    onValueChange={(value) => handleCriteriaChange('activity_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="high">High Activity</SelectItem>
                      <SelectItem value="medium">Medium Activity</SelectItem>
                      <SelectItem value="low">Low Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe this user segment..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>XP Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min XP"
                      value={formData.criteria.xp_range.min}
                      onChange={(e) => handleCriteriaChange('xp_range', {
                        ...formData.criteria.xp_range,
                        min: parseInt(e.target.value) || 0
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max XP"
                      value={formData.criteria.xp_range.max}
                      onChange={(e) => handleCriteriaChange('xp_range', {
                        ...formData.criteria.xp_range,
                        max: parseInt(e.target.value) || 1000
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning_style">Learning Style</Label>
                  <Select
                    value={formData.criteria.learning_style}
                    onValueChange={(value) => handleCriteriaChange('learning_style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                      <SelectItem value="reading">Reading/Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Segment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Segments List */}
      <div className="grid gap-4">
        {segments.map((segment) => (
          <Card key={segment.id} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{segment.name}</h3>
                  <Badge variant="secondary">
                    {segment.user_count} users
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{segment.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Criteria: {getCriteriaDescription(segment.criteria)}</span>
                <span>•</span>
                <span>Created: {new Date(segment.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {segments.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No segments created yet</h3>
              <p className="text-gray-500 mb-4">
                Create user segments to apply targeted threshold configurations.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Segment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserSegmentManager;
