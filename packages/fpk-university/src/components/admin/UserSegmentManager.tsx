
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { UserSegment } from '@/hooks/useThresholdManagement';

interface UserSegmentManagerProps {
  segments: UserSegment[];
  onCreateSegment: (segment: Omit<UserSegment, 'id' | 'user_count' | 'created_at'>) => void;
}

const UserSegmentManager: React.FC<UserSegmentManagerProps> = ({
  segments,
  onCreateSegment
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: '{}',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const criteria = JSON.parse(formData.criteria);
      onCreateSegment({
        name: formData.name,
        description: formData.description,
        criteria,
      });
      setFormData({ name: '', description: '', criteria: '{}' });
      setIsCreating(false);
    } catch (error) {
      console.error('Invalid JSON criteria:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Segments</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {isCreating && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Create New User Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Segment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter segment name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this user segment"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="criteria">Criteria (JSON)</Label>
                <Textarea
                  id="criteria"
                  value={formData.criteria}
                  onChange={(e) => setFormData(prev => ({ ...prev, criteria: e.target.value }))}
                  placeholder='{"role": "student", "level": "beginner"}'
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Segment</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {segments.map((segment) => (
          <Card key={segment.id} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{segment.name}</h3>
                  <Badge variant="outline">
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

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Criteria:</h4>
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(segment.criteria, null, 2)}
                </pre>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Created: {new Date(segment.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {segments.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No user segments found</h3>
              <p className="text-gray-500">
                Create your first user segment to organize threshold configurations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserSegmentManager;
