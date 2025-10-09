import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Users, UserPlus, Check } from 'lucide-react';

const DIAGNOSIS_OPTIONS = [
  'Autism Spectrum Disorder',
  'ADHD',
  'Speech/Language Delay',
  'Developmental Delay',
  'Learning Disability',
  'Epilepsy',
  'Cerebral Palsy',
  'Down Syndrome',
  'Other',
];

const OnboardingWizard = () => {
  // All hooks must be called before any early returns
  const [step, setStep] = useState(1);
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  
  // Step 1: Family Profile
  const [familyName, setFamilyName] = useState('');

  // Step 2: First Student
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<string[]>([]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Only redirect if we're sure there's no user (not during initial loading)
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleDiagnosisToggle = (diagnosis: string) => {
    setPrimaryDiagnosis(prev =>
      prev.includes(diagnosis)
        ? prev.filter(d => d !== diagnosis)
        : [...prev, diagnosis]
    );
  };

  const handleSubmit = async () => {
    if (!user || !session) {
      toast.error('Authentication required. Please sign in again.');
      navigate('/auth');
      return;
    }

    try {
      console.log('Starting onboarding with user:', user.id);
      console.log('Session:', session);

      // Verify we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Current session from Supabase:', currentSession);

      if (!currentSession) {
        toast.error('No active session. Please sign in again.');
        navigate('/auth');
        return;
      }

      // 1. Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({ 
          family_name: familyName, 
          created_by: currentSession.user.id 
        })
        .select()
        .single();

      if (familyError) {
        console.error('Family creation error:', familyError);
        throw new Error(`Failed to create family: ${familyError.message}`);
      }

      console.log('Family created:', family);

      // 2. Add user as family owner
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: user.id,
          role: 'owner',
          relationship_to_student: 'Parent/Guardian',
        });

      if (memberError) {
        console.error('Member creation error:', memberError);
        throw new Error(`Failed to add family member: ${memberError.message}`);
      }

      console.log('Family member created');

      // 3. Create first student
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          family_id: family.id,
          student_name: studentName,
          date_of_birth: dateOfBirth,
          school_name: schoolName || null,
          grade_level: gradeLevel || null,
          primary_diagnosis: primaryDiagnosis,
        });

      if (studentError) {
        console.error('Student creation error:', studentError);
        throw new Error(`Failed to create student: ${studentError.message}`);
      }

      console.log('Student created');

      // 4. Create default dashboard config
      const { error: configError } = await supabase
        .from('family_dashboard_config')
        .insert({
          family_id: family.id,
          visible_sections: ['student_overview', 'educator_logs', 'progress_tracking'],
        });

      if (configError) {
        console.error('Config creation error:', configError);
        // Non-critical error, don't block onboarding
        console.warn('Dashboard config creation failed, continuing anyway');
      }

      toast.success('Welcome! Your family profile is ready.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'var(--gradient-subtle)' }}>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Welcome to Progress Hub</CardTitle>
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Create Your Family Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    This helps organize your students and team members
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  placeholder="The Smith Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  You can change this later in settings
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!familyName.trim()}
                className="w-full"
              >
                Continue
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add Your First Student</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add more students later
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    placeholder="First and last name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      placeholder="e.g., 3rd Grade"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    placeholder="Name of school"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!studentName.trim() || !dateOfBirth}
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Primary Diagnosis</h3>
                  <p className="text-sm text-muted-foreground">
                    Select all that apply (optional)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DIAGNOSIS_OPTIONS.map((diagnosis) => (
                  <div key={diagnosis} className="flex items-center space-x-2">
                    <Checkbox
                      id={diagnosis}
                      checked={primaryDiagnosis.includes(diagnosis)}
                      onCheckedChange={() => handleDiagnosisToggle(diagnosis)}
                    />
                    <label
                      htmlFor={diagnosis}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {diagnosis}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Complete Setup
                  <Check className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
