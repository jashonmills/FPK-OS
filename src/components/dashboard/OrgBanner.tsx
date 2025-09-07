import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';

const OrgBanner = () => {
  const navigate = useNavigate();
  const { organizations, isPersonalMode } = useOrgContext();

  // Don't show banner if user has organizations
  if (!isPersonalMode || organizations.length > 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Building2 className="h-5 w-5" />
          Join a Class or Create an Organization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-blue-700 mb-4">
          Get the most out of FPK University by joining a class or creating your own organization. 
          Connect with other learners, access exclusive content, and track your progress together.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/org/join')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Join with Invitation Code
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/org/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgBanner;