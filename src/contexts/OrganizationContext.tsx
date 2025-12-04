import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Organization {
  id: string;
  org_name: string;
  org_type: 'school' | 'district' | 'clinic' | 'therapy_center';
  subscription_tier: string;
  logo_url?: string;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'org_owner' | 'district_admin' | 'school_admin' | 'teacher' | 'therapist' | 'specialist' | 'support_staff';
  caseload_student_ids: string[];
  permissions: {
    can_invite: boolean;
    can_manage_students: boolean;
    can_view_analytics: boolean;
  };
  is_active: boolean;
}

interface Student {
  id: string;
  student_name: string;
  date_of_birth: string;
  grade_level?: string;
  organization_id?: string;
  school_name?: string;
  primary_diagnosis?: string[];
  secondary_conditions?: string[];
  profile_image_url?: string;
  is_active?: boolean;
}

interface OrganizationContextType {
  selectedOrganization: Organization | null;
  selectedStudent: Student | null;
  organizations: Organization[];
  students: Student[];
  organizationMembership: OrganizationMember | null;
  isLoading: boolean;
  hasOrganizationMembership: boolean;
  setSelectedOrganization: (org: Organization | null) => void;
  setSelectedStudent: (student: Student | null) => void;
  refreshOrganizations: () => Promise<void>;
  refreshStudents: () => Promise<void>;
  userId: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const [selectedOrganization, setSelectedOrganizationState] = useState<Organization | null>(null);
  const [selectedStudent, setSelectedStudentState] = useState<Student | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [organizationMembership, setOrganizationMembership] = useState<OrganizationMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch organizations when user changes
  useEffect(() => {
    if (userId) {
      refreshOrganizations();
    } else {
      setOrganizations([]);
      setSelectedOrganizationState(null);
      setOrganizationMembership(null);
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch students when organization changes
  useEffect(() => {
    if (selectedOrganization) {
      refreshStudents();
    } else {
      setStudents([]);
      setSelectedStudentState(null);
    }
  }, [selectedOrganization?.id]);

  const refreshOrganizations = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Fetch user's organization memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (membershipsError) throw membershipsError;

      if (!memberships || memberships.length === 0) {
        setOrganizations([]);
        setSelectedOrganizationState(null);
        setOrganizationMembership(null);
        setIsLoading(false);
        return;
      }

      // Fetch organizations data
      const orgIds = memberships.map(m => m.organization_id);
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', orgIds)
        .eq('is_active', true);

      if (orgsError) throw orgsError;

      setOrganizations(orgsData as Organization[] || []);

      // Auto-select first organization if none selected
      const savedOrgId = localStorage.getItem('selectedOrganizationId');
      const orgToSelect = savedOrgId 
        ? orgsData?.find(o => o.id === savedOrgId) || orgsData?.[0]
        : orgsData?.[0];

      if (orgToSelect) {
        setSelectedOrganizationState(orgToSelect as unknown as Organization);
        const membership = memberships.find(m => m.organization_id === orgToSelect.id);
        setOrganizationMembership(membership as unknown as OrganizationMember || null);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStudents = async () => {
    if (!selectedOrganization) return;

    try {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .eq('organization_id', selectedOrganization.id)
        .eq('is_active', true)
        .order('student_name');

      if (error) throw error;

      setStudents(studentsData || []);

      // Auto-select first student if none selected
      const savedStudentId = localStorage.getItem(`selectedStudentId_org_${selectedOrganization.id}`);
      const studentToSelect = savedStudentId
        ? studentsData?.find(s => s.id === savedStudentId) || studentsData?.[0]
        : studentsData?.[0];

      if (studentToSelect) {
        setSelectedStudentState(studentToSelect);
      }
    } catch (error) {
      console.error('Error fetching organization students:', error);
    }
  };

  const setSelectedOrganization = (org: Organization | null) => {
    setSelectedOrganizationState(org);
    if (org) {
      localStorage.setItem('selectedOrganizationId', org.id);
      
      // Update membership info
      const membership = organizations.find(o => o.id === org.id);
      if (membership) {
        // Fetch membership details
        supabase
          .from('organization_members')
          .select('*')
          .eq('organization_id', org.id)
          .eq('user_id', userId!)
          .eq('is_active', true)
          .single()
          .then(({ data }) => {
            setOrganizationMembership(data as unknown as OrganizationMember);
          });
      }
    } else {
      localStorage.removeItem('selectedOrganizationId');
      setOrganizationMembership(null);
    }
  };

  const setSelectedStudent = (student: Student | null) => {
    setSelectedStudentState(student);
    if (student && selectedOrganization) {
      localStorage.setItem(`selectedStudentId_org_${selectedOrganization.id}`, student.id);
    } else if (selectedOrganization) {
      localStorage.removeItem(`selectedStudentId_org_${selectedOrganization.id}`);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        selectedOrganization,
        selectedStudent,
        organizations,
        students,
        organizationMembership,
        isLoading,
        hasOrganizationMembership: organizations.length > 0,
        setSelectedOrganization,
        setSelectedStudent,
        refreshOrganizations,
        refreshStudents,
        userId,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
