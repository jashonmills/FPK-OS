import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Safe hook that works with or without OrgProvider
function useSafeOrgContext() {
  try {
    const { useOrgContext } = require('@/components/organizations/OrgContext');
    return useOrgContext();
  } catch (error) {
    // Return safe defaults when OrgProvider is not available (personal mode)
    return {
      organizations: [],
      isPersonalMode: true
    };
  }
}

const OrgBanner = () => {
  const navigate = useNavigate();
  const {
    organizations,
    isPersonalMode
  } = useSafeOrgContext();

  // Don't show banner if user has organizations
  if (!isPersonalMode || organizations.length > 0) {
    return null;
  }
  return <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      
      
    </Card>;
};
export default OrgBanner;