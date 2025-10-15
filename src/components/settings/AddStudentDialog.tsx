import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { useFamily } from '@/contexts/FamilyContext';

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

interface AddStudentDialogProps {
  onStudentAdded: () => void;
  currentStudentCount: number;
  maxStudents: number;
}

export const AddStudentDialog = ({ onStudentAdded, currentStudentCount, maxStudents }: AddStudentDialogProps) => {
  const { selectedFamily } = useFamily();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<string[]>([]);
  const [secondaryConditions, setSecondaryConditions] = useState<string[]>([]);

  const canAddMore = maxStudents === -1 || currentStudentCount < maxStudents;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim() || !dateOfBirth) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedFamily) {
      toast.error('No family selected');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert({
          family_id: selectedFamily.id,
          student_name: studentName.trim(),
          date_of_birth: dateOfBirth,
          school_name: schoolName.trim() || null,
          grade_level: gradeLevel || null,
          primary_diagnosis: primaryDiagnosis,
          secondary_conditions: secondaryConditions,
        });

      if (error) throw error;

      toast.success(`${studentName} added successfully!`);
      
      // Reset form
      setStudentName('');
      setDateOfBirth('');
      setSchoolName('');
      setGradeLevel('');
      setPrimaryDiagnosis([]);
      setSecondaryConditions([]);
      
      setOpen(false);
      onStudentAdded();
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(error.message || 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canAddMore}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
          {maxStudents !== -1 && ` (${currentStudentCount}/${maxStudents})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Add a child or student to your account
            {maxStudents !== -1 && ` (${currentStudentCount} of ${maxStudents} used)`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student-name">
                Student Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., Alex Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School Name (Optional)</Label>
              <Input
                id="school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., Lincoln Elementary School"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level (Optional)</Label>
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
            <Label>Primary Focus Areas (Optional)</Label>
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
