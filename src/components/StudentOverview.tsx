import React from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, School, Award, Activity } from 'lucide-react';

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const StudentOverview = () => {
  const { selectedStudent } = useFamily();

  if (!selectedStudent) return null;

  const age = calculateAge(selectedStudent.date_of_birth);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Age</CardTitle>
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{age} years old</div>
          <p className="text-xs text-muted-foreground mt-1">
            Born {new Date(selectedStudent.date_of_birth).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">School</CardTitle>
          <School className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {selectedStudent.school_name || 'Not set'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedStudent.grade_level || 'Grade not specified'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Primary Diagnosis</CardTitle>
          <Award className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedStudent.primary_diagnosis && selectedStudent.primary_diagnosis.length > 0 ? (
              selectedStudent.primary_diagnosis.slice(0, 2).map((diagnosis) => (
                <Badge key={diagnosis} variant="secondary" className="text-xs">
                  {diagnosis}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Not specified</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Activity className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0 logs</div>
          <p className="text-xs text-muted-foreground mt-1">
            This week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
