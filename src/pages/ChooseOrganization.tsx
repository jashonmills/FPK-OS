import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';

interface OrgMembership {
  org_id: string;
  organizations: {
    name: string;
    logo_url?: string;
  };
}

export default function ChooseOrganization() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<OrgMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrgs = async () => {
      const { data, error } = await supabase
        .from('org_members')
        .select('org_id, organizations(name, logo_url)')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Failed to fetch organizations', error);
        navigate('/no-organization-access');
        return;
      }

      if (!data || data.length === 0) {
        navigate('/no-organization-access');
        return;
      }

      setOrgs(data as OrgMembership[]);
      setLoading(false);
    };

    fetchOrgs();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fpk-purple to-fpk-amber flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Select Your Organization</CardTitle>
          <CardDescription>
            You have access to multiple organizations. Choose one to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orgs.map((org) => (
            <Button
              key={org.org_id}
              variant="outline"
              className="w-full h-auto py-4 px-6 justify-between hover:bg-primary/5 hover:border-primary"
              onClick={() => navigate(`/org/${org.org_id}`)}
            >
              <div className="flex items-center gap-3">
                {org.organizations.logo_url ? (
                  <img 
                    src={org.organizations.logo_url} 
                    alt={org.organizations.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
                <span className="font-medium text-lg">{org.organizations.name}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
