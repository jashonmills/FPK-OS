import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { School, Edit, Save, X } from 'lucide-react';

interface StudentProfileCardProps {
  student: {
    id: string;
    student_name: string;
    date_of_birth: string;
    school_name: string | null;
    grade_level: string | null;
    primary_diagnosis: string[];
    secondary_conditions: string[] | null;
  };
  onUpdate: () => void;
}

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

const GRADE_OPTIONS = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Other',
];

export const StudentProfileCard = ({ student, onUpdate }: StudentProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [studentName, setStudentName] = useState(student.student_name);
  const [dateOfBirth, setDateOfBirth] = useState(student.date_of_birth);
  const [schoolName, setSchoolName] = useState(student.school_name || '');
  const [gradeLevel, setGradeLevel] = useState(student.grade_level || '');
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<string[]>(student.primary_diagnosis || []);
  const [secondaryConditions, setSecondaryConditions] = useState<string[]>(student.secondary_conditions || []);

  const handleDiagnosisToggle = (diagnosis: string, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryDiagnosis(prev =>
        prev.includes(diagnosis)
          ? prev.filter(d => d !== diagnosis)
          : [...prev, diagnosis]
      );
    } else {
      setSecondaryConditions(prev =>
        prev.includes(diagnosis)
          ? prev.filter(d => d !== diagnosis)
          : [...prev, diagnosis]
      );
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          student_name: studentName,
          date_of_birth: dateOfBirth,
          school_name: schoolName || null,
          grade_level: gradeLevel || null,
          primary_diagnosis: primaryDiagnosis,
          secondary_conditions: secondaryConditions,
        })
        .eq('id', student.id);

      if (error) throw error;

      toast.success('Student profile updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast.error(error.message || 'Failed to update student profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setStudentName(student.student_name);
    setDateOfBirth(student.date_of_birth);
    setSchoolName(student.school_name || '');
    setGradeLevel(student.grade_level || '');
    setPrimaryDiagnosis(student.primary_diagnosis || []);
    setSecondaryConditions(student.secondary_conditions || []);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <School className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>{student.student_name}</CardTitle>
            <CardDescription>Student Profile</CardDescription>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g., Lincoln Elementary School"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Primary Focus Areas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DIAGNOSIS_OPTIONS.map((diagnosis) => (
                  <div key={`primary-${diagnosis}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`primary-${diagnosis}`}
                      checked={primaryDiagnosis.includes(diagnosis)}
                      onCheckedChange={() => handleDiagnosisToggle(diagnosis, true)}
                    />
                    <label
                      htmlFor={`primary-${diagnosis}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {diagnosis}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Secondary Conditions (Optional)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DIAGNOSIS_OPTIONS.map((diagnosis) => (
                  <div key={`secondary-${diagnosis}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`secondary-${diagnosis}`}
                      checked={secondaryConditions.includes(diagnosis)}
                      onCheckedChange={() => handleDiagnosisToggle(diagnosis, false)}
                    />
                    <label
                      htmlFor={`secondary-${diagnosis}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {diagnosis}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Age</p>
              <p className="text-sm">
                {Math.floor(
                  (new Date().getTime() - new Date(student.date_of_birth).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                )}{' '}
                years old
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">School</p>
              <p className="text-sm">{student.school_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
              <p className="text-sm">{student.grade_level || 'Not set'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Primary Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {student.primary_diagnosis && student.primary_diagnosis.length > 0 ? (
                  student.primary_diagnosis.map((diagnosis) => (
                    <span
                      key={diagnosis}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {diagnosis}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Not specified</p>
                )}
              </div>
            </div>
            {student.secondary_conditions && student.secondary_conditions.length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Secondary Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {student.secondary_conditions.map((condition) => (
                    <span
                      key={condition}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
