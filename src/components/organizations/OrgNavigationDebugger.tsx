import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useOrgContext } from './OrgContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug } from 'lucide-react';

export function OrgNavigationDebugger() {
  const location = useLocation();
  const params = useParams();
  const { currentOrg, activeOrgId, isPersonalMode } = useOrgContext();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bug className="h-4 w-4" />
          Organization Navigation Debug
        </CardTitle>
        <CardDescription className="text-xs">
          Development only - Remove for production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Badge variant="outline" className="mb-1">URL Info</Badge>
            <div>Path: {location.pathname}</div>
            <div>Search: {location.search}</div>
            <div>Params: {JSON.stringify(params)}</div>
          </div>
          <div>
            <Badge variant="outline" className="mb-1">Org Context</Badge>
            <div>Active Org ID: {activeOrgId || 'none'}</div>
            <div>Current Org: {currentOrg?.organizations?.name || 'none'}</div>
            <div>Personal Mode: {isPersonalMode ? 'yes' : 'no'}</div>
            <div>User Role: {currentOrg?.role || 'none'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}