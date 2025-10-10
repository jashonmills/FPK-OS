import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Users, UserPlus, Moon, Target } from 'lucide-react';
import { AppBackground } from '@/components/layout/AppBackground';

const DIAGNOSIS_OPTIONS = [
  'Autism Spectrum Disorder',
  'ADHD',
  'Dyslexia',
  'Speech Delay',
  'Anxiety',
  'Sensory Processing Disorder',
  'Intellectual Disability',
  'Down Syndrome',
  'Other',
];

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Step 1: Family Setup
  const [familyName, setFamilyName] = useState("");
  
  // Step 2: Child Info
  const [studentName, setStudentName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<string[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  
  // Step 3: 30-Day Snapshot
  const [sleepQuality, setSleepQuality] = useState("good");
  const [averageSleepHours, setAverageSleepHours] = useState(8);
  const [frequentMood, setFrequentMood] = useState("calm");
  const [incidentFrequency, setIncidentFrequency] = useState("occasionally");
  
  // Step 4: Initial Goal
  const [goalTitle, setGoalTitle] = useState("");
  const [goalType, setGoalType] = useState<"academic" | "behavioral" | "social" | "life_skill">("behavioral");
  const [targetDate, setTargetDate] = useState("");
  
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
      const { data: { session: currentSession } } = await supabase.auth.getSession();

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

      if (familyError) throw new Error(`Failed to create family: ${familyError.message}`);

      // 2. Add user as family owner
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: user.id,
          role: 'owner',
          relationship_to_student: 'Parent/Guardian',
        });

      if (memberError) throw new Error(`Failed to add family member: ${memberError.message}`);

      // 3. Create first student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          family_id: family.id,
          student_name: studentName,
          date_of_birth: dateOfBirth,
          primary_diagnosis: primaryDiagnosis,
          school_name: schoolName || null,
          grade_level: gradeLevel || null,
        })
        .select()
        .single();

      if (studentError) throw new Error(`Failed to create student: ${studentError.message}`);

      // 4. Create dashboard config
      const { error: configError } = await supabase
        .from('family_dashboard_config')
        .insert({
          family_id: family.id,
          visible_sections: ['student_overview', 'educator_logs', 'progress_tracking'],
        });

      if (configError) console.warn('Dashboard config creation failed');

      // 5. Create baseline sleep records (past 5 days)
      const sleepRecords = Array.from({ length: 5 }, (_, i) => {
        const recordDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
        return {
          family_id: family.id,
          student_id: student.id,
          sleep_date: recordDate.toISOString().split('T')[0],
          bedtime: '20:00',
          wake_time: '07:00',
          total_sleep_hours: averageSleepHours,
          sleep_quality_rating: sleepQuality === 'excellent' ? 5 : sleepQuality === 'good' ? 4 : sleepQuality === 'fair' ? 3 : sleepQuality === 'poor' ? 2 : 1,
          created_by: user.id,
        };
      });

      const { error: sleepError } = await supabase
        .from('sleep_records')
        .insert(sleepRecords);

      if (sleepError) console.warn('Sleep records creation failed');

      // 6. Create baseline parent logs for mood tracking (past 7 days)
      const moodLogs = Array.from({ length: 7 }, (_, i) => {
        const logDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
        return {
          family_id: family.id,
          student_id: student.id,
          log_date: logDate.toISOString().split('T')[0],
          log_time: '18:00',
          reporter_name: studentName + "'s Parent",
          location: 'Home',
          activity_type: 'General Observation',
          observation: 'Initial baseline data from onboarding',
          mood: frequentMood,
          created_by: user.id,
        };
      });

      const { error: moodError } = await supabase
        .from('parent_logs')
        .insert(moodLogs);

      if (moodError) console.warn('Mood logs creation failed');

      // 7. Create incident baseline if applicable
      if (incidentFrequency !== 'rarely') {
        const incidentCount = 
          incidentFrequency === 'daily' ? 3 : 
          incidentFrequency === 'frequently' ? 2 : 1;

        const incidents = Array.from({ length: incidentCount }, (_, i) => {
          const incidentDate = new Date(Date.now() - ((i + 1) * 7 * 24 * 60 * 60 * 1000));
          return {
            family_id: family.id,
            student_id: student.id,
            incident_date: incidentDate.toISOString().split('T')[0],
            incident_time: '14:00',
            incident_type: 'behavioral',
            severity: 'moderate',
            location: 'School',
            reporter_role: 'Teacher',
            reporter_name: 'Baseline Data',
            behavior_description: 'Baseline incident data from onboarding',
            created_by: user.id,
          };
        });

        const { error: incidentError } = await supabase
          .from('incident_logs')
          .insert(incidents);

        if (incidentError) console.warn('Incident baseline creation failed');
      }

      // 8. Create initial goal
      if (goalTitle.trim()) {
        const { error: goalError } = await supabase
          .from('goals')
          .insert({
            family_id: family.id,
            student_id: student.id,
            goal_title: goalTitle,
            goal_type: goalType,
            target_date: targetDate || null,
            target_value: 100,
            current_value: 0,
            unit: '%',
          });

        if (goalError) console.warn('Goal creation failed');
      }

      toast.success('Welcome! Your dashboard is ready with initial data.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <>
      <AppBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card w-full max-w-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">The 5-Minute Foundation</CardTitle>
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="pt-6">
            {/* Step 1: Family Setup */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Welcome! Let's create your family's secure space.</h3>
                    <p className="text-sm text-muted-foreground">
                      This helps organize your students and team members
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyName">What would you like to name your family hub?</Label>
                  <Input
                    id="familyName"
                    placeholder="The Mills Family or Team Jackson"
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
                  Create My Hub
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Child Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Tell us about your amazing child</h3>
                    <p className="text-sm text-muted-foreground">
                      You can add more students later
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">What is your child's first name?</Label>
                    <Input
                      id="studentName"
                      placeholder="First name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">And their date of birth?</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Primary focus areas (select all that apply)</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      This helps tailor insights and analytics to your child's needs
                    </p>
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
                  </div>

                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">What school does your child attend? (Optional)</Label>
                      <Input
                        id="schoolName"
                        placeholder="e.g., Lincoln Elementary School"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps us show school information in your dashboard analytics
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">What grade are they in? (Optional)</Label>
                      <Select value={gradeLevel} onValueChange={setGradeLevel}>
                        <SelectTrigger id="gradeLevel">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pre-K">Pre-K</SelectItem>
                          <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="1st Grade">1st Grade</SelectItem>
                          <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                          <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                          <SelectItem value="4th Grade">4th Grade</SelectItem>
                          <SelectItem value="5th Grade">5th Grade</SelectItem>
                          <SelectItem value="6th Grade">6th Grade</SelectItem>
                          <SelectItem value="7th Grade">7th Grade</SelectItem>
                          <SelectItem value="8th Grade">8th Grade</SelectItem>
                          <SelectItem value="9th Grade">9th Grade</SelectItem>
                          <SelectItem value="10th Grade">10th Grade</SelectItem>
                          <SelectItem value="11th Grade">11th Grade</SelectItem>
                          <SelectItem value="12th Grade">12th Grade</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                    Next: Build Their Baseline
                    <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 30-Day Snapshot */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Let's paint a picture of the last month</h3>
                    <p className="text-sm text-muted-foreground">
                      Your answers will build your first charts
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Reflecting on the past month, how would you describe {studentName}'s overall sleep quality?</Label>
                    <Select value={sleepQuality} onValueChange={setSleepQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">😊 Excellent</SelectItem>
                        <SelectItem value="good">🙂 Good</SelectItem>
                        <SelectItem value="fair">😐 Fair</SelectItem>
                        <SelectItem value="poor">😟 Poor</SelectItem>
                        <SelectItem value="very_poor">😢 Very Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>On an average night, about how many hours of sleep did they get?</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[averageSleepHours]}
                        onValueChange={(value) => setAverageSleepHours(value[0])}
                        min={4}
                        max={12}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold min-w-[3rem]">{averageSleepHours}h</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>In the last 30 days, what was their most frequent overall mood or disposition?</Label>
                    <Select value={frequentMood} onValueChange={setFrequentMood}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">😊 Happy/Content</SelectItem>
                        <SelectItem value="calm">😌 Calm/Regulated</SelectItem>
                        <SelectItem value="anxious">😰 Anxious/Worried</SelectItem>
                        <SelectItem value="agitated">😤 Agitated/Irritable</SelectItem>
                        <SelectItem value="tired">😴 Tired/Lethargic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Thinking about challenging moments (meltdowns, outbursts, etc.), how frequent were they?</Label>
                    <Select value={incidentFrequency} onValueChange={setIncidentFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rarely">Rarely (1-2 times)</SelectItem>
                        <SelectItem value="occasionally">Occasionally (Once a week)</SelectItem>
                        <SelectItem value="frequently">Frequently (Several times a week)</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)} className="flex-1">
                    Next: Set a Goal
                    <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Initial Goal */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Let's focus on what matters most to you</h3>
                    <p className="text-sm text-muted-foreground">
                      Progress starts with a single step
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalTitle">In a few words, what is one thing you'd like to improve?</Label>
                    <Input
                      id="goalTitle"
                      placeholder="e.g., Smoother morning routines, Reduce meltdowns after school"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Examples: Improve reading stamina, Better transitions between activities
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goalType">What category does this fall into?</Label>
                    <Select value={goalType} onValueChange={(value: any) => setGoalType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="life_skill">Life Skill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target date (optional)</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Finish & Go to Dashboard
                    <Target className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OnboardingWizard;
