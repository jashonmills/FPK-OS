import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

const OrganizationFinderPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug, logo_url')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching organizations:', error);
      } else if (data) {
        setOrganizations(data);
      }
      setIsLoading(false);
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = useMemo(() => {
    if (!searchTerm) {
      return organizations;
    }
    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, organizations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Finding organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Organization</h1>
          <p className="text-white/80 text-lg">
            Select your school or organization from the list below to continue to your login page.
          </p>
        </div>

        <Card className="mb-6 border-0 shadow-2xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by organization name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map(org => (
              <Link 
                to={`/${org.slug}`} 
                key={org.id}
                className="block transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {org.logo_url ? (
                        <img 
                          src={org.logo_url} 
                          alt={`${org.name} logo`}
                          className="w-12 h-12 object-contain rounded-lg bg-background p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-lg font-semibold text-foreground flex-1">
                        {org.name}
                      </span>
                      <div className="text-muted-foreground">→</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No organizations found matching your search.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationFinderPage;
