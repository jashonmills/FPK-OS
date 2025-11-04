import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PayrollDashboard } from '@/components/payroll/PayrollDashboard';
import { PayrollRunsHistory } from '@/components/payroll/PayrollRunsHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Payroll = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (data?.role !== 'admin') {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminRole();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Payroll Command Center
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage company-wide payroll and time tracking
            </p>
          </div>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="text-sm md:text-base">Current Period</TabsTrigger>
            <TabsTrigger value="history" className="text-sm md:text-base">Payroll History</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <PayrollDashboard />
          </TabsContent>

          <TabsContent value="history">
            <PayrollRunsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Payroll;
