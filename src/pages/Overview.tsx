import { useNavigate } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, TrendingUp, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Overview() {
  const navigate = useNavigate();
  const { students, families, selectedFamily, setSelectedStudent } = useFamily();

  // Fetch family members
  const { data: familyMembers } = useQuery({
    queryKey: ['family-members', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return [];
      
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          id,
          role,
          relationship_to_student,
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('family_id', selectedFamily.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  // Fetch aggregate analytics
  const { data: analytics } = useQuery({
    queryKey: ['overview-analytics', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [educatorLogs, goals] = await Promise.all([
        supabase
          .from('educator_logs')
          .select('id', { count: 'exact', head: true })
          .eq('family_id', selectedFamily.id)
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('goals')
          .select('id', { count: 'exact', head: true })
          .eq('family_id', selectedFamily.id)
          .eq('is_active', true),
      ]);

      return {
        totalLogsThisMonth: educatorLogs.count || 0,
        activeGoals: goals.count || 0,
      };
    },
    enabled: !!selectedFamily?.id,
  });

  const handleViewDashboard = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome to FPK-X</h1>
        <p className="text-muted-foreground">
          Your central hub for managing student progress and team collaboration
        </p>
      </div>

      {/* Student Profiles Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Students</h2>
          <Button onClick={() => navigate('/settings?tab=students')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.profile_image_url || student.photo_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {student.student_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {student.student_name}
                    </CardTitle>
                    {student.date_of_birth && (
                      <CardDescription>
                        Age {new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleViewDashboard(student.id)}
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Members Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <CardTitle>Team Members</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings?tab=members')}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {familyMembers?.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {member.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.profiles?.full_name || 'Unknown'}</p>
                      {member.relationship_to_student && (
                        <p className="text-sm text-muted-foreground">
                          {member.relationship_to_student}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High-Level Analytics Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Activity Overview</CardTitle>
            </div>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Log Entries</p>
                  <p className="text-3xl font-bold">{analytics?.totalLogsThisMonth || 0}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-3xl font-bold">{analytics?.activeGoals || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
