import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_name: string;
  date_of_birth: string;
  school_name: string | null;
  grade_level: string | null;
  primary_diagnosis: string[];
  secondary_conditions: string[] | null;
  photo_url: string | null;
  profile_image_url: string | null;
  personal_notes: string | null;
}

interface Family {
  id: string;
  family_name: string;
  subscription_tier: string;
}

interface FamilyMember {
  id: string;
  family_id: string;
  role: string;
}

interface FamilyContextType {
  selectedFamily: Family | null;
  selectedStudent: Student | null;
  families: Family[];
  students: Student[];
  familyMembership: FamilyMember | null;
  currentUserRole: 'owner' | 'contributor' | 'viewer' | null;
  setSelectedFamily: (family: Family) => void;
  setSelectedStudent: (student: Student) => void;
  refreshFamilies: () => Promise<void>;
  refreshStudents: () => Promise<void>;
  isLoading: boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFamily, setSelectedFamilyState] = useState<Family | null>(null);
  const [selectedStudent, setSelectedStudentState] = useState<Student | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [familyMembership, setFamilyMembership] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load families when user changes
  const refreshFamilies = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: memberships, error } = await supabase
        .from('family_members')
        .select(`
          id,
          family_id,
          role,
          families (
            id,
            family_name,
            subscription_tier
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching memberships:', error);
        throw error;
      }

      console.log('Memberships data:', memberships);

      if (memberships && memberships.length > 0) {
        // Extract families from memberships - handle both nested object and array formats
        const familyList = memberships
          .map(m => {
            // Supabase returns nested relations as objects, not arrays
            const family = m.families as any;
            return family;
          })
          .filter((f): f is Family => f !== null && f !== undefined);
        
        console.log('Extracted families:', familyList);
        setFamilies(familyList);

        // Auto-select family
        const storedFamilyId = localStorage.getItem('selected_family_id');
        const defaultFamily = familyList.find(f => f.id === storedFamilyId) || familyList[0];
        
        console.log('Selected family:', defaultFamily);
        
        if (defaultFamily) {
          setSelectedFamilyState(defaultFamily);
          const membership = memberships.find(m => {
            const fam = m.families as any;
            return fam?.id === defaultFamily.id;
          });
          setFamilyMembership(membership || null);
        }
      } else {
        console.log('No memberships found for user');
      }
    } catch (error) {
      console.error('Error loading families:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFamilies();
  }, [userId]);

  // Load students when family changes
  const refreshStudents = async () => {
    if (!selectedFamily) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setStudents(data);

        // Auto-select student
        const storedStudentId = localStorage.getItem(`selected_student_${selectedFamily.id}`);
        const defaultStudent = data.find(s => s.id === storedStudentId) || data[0];
        setSelectedStudentState(defaultStudent);
      } else {
        setStudents([]);
        setSelectedStudentState(null);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  useEffect(() => {
    refreshStudents();
    if (selectedFamily) {
      localStorage.setItem('selected_family_id', selectedFamily.id);
    }
  }, [selectedFamily]);

  const setSelectedFamily = (family: Family) => {
    setSelectedFamilyState(family);
    const membership = families.find(f => f.id === family.id);
    setFamilyMembership(membership as any || null);
  };

  const setSelectedStudent = (student: Student) => {
    setSelectedStudentState(student);
    if (selectedFamily) {
      localStorage.setItem(`selected_student_${selectedFamily.id}`, student.id);
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        selectedFamily,
        selectedStudent,
        families,
        students,
        familyMembership,
        currentUserRole: familyMembership?.role as 'owner' | 'contributor' | 'viewer' | null,
        setSelectedFamily,
        setSelectedStudent,
        refreshFamilies,
        refreshStudents,
        isLoading,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
};
