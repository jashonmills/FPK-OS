import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';
const OrgBanner = () => {
  const navigate = useNavigate();
  const {
    organizations,
    isPersonalMode
  } = useOrgContext();

  // Don't show banner if user has organizations
  if (!isPersonalMode || organizations.length > 0) {
    return null;
  }
  return <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      
      
    </Card>;
};
export default OrgBanner;