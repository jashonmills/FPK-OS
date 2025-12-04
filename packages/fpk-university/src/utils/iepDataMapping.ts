import { OrgStudent } from '@/hooks/useOrgStudents';

export interface IEPStudentProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age?: string;
  grade: string;
  school?: string;
  studentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  primaryLanguage?: string;
  medicalInfo?: string;
  previousServices?: string;
}

/**
 * Maps OrgStudent data to IEP Student Profile form format
 */
export function mapStudentToIEPData(student: OrgStudent): IEPStudentProfileData {
  // Split full name into first and last name
  const nameParts = student.full_name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): string => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Extract emergency contact information
  const emergencyContact = student.emergency_contact || {};
  const parentName = emergencyContact.name || '';
  const parentPhone = emergencyContact.phone || '';
  const address = emergencyContact.address || '';

  return {
    firstName,
    lastName,
    dateOfBirth: student.date_of_birth || '',
    age: student.date_of_birth ? calculateAge(student.date_of_birth) : '',
    grade: mapGradeLevel(student.grade_level),
    school: '', // Not available in OrgStudent, user will need to fill this
    studentId: student.student_id || '',
    parentName,
    parentPhone,
    parentEmail: student.parent_email || '',
    address,
    primaryLanguage: '', // Not available in OrgStudent
    medicalInfo: '', // Not available in OrgStudent
    previousServices: '', // Not available in OrgStudent
  };
}

/**
 * Maps grade level to IEP wizard format
 */
function mapGradeLevel(gradeLevel?: string): string {
  if (!gradeLevel) return '';
  
  const grade = gradeLevel.toLowerCase();
  
  // Handle various grade formats
  if (grade.includes('pre-k') || grade.includes('prek')) return 'pre-k';
  if (grade.includes('k') || grade === 'kindergarten') return 'k';
  if (grade.includes('1st') || grade === '1') return '1';
  if (grade.includes('2nd') || grade === '2') return '2';
  if (grade.includes('3rd') || grade === '3') return '3';
  if (grade.includes('4th') || grade === '4') return '4';
  if (grade.includes('5th') || grade === '5') return '5';
  if (grade.includes('6th') || grade === '6') return '6';
  if (grade.includes('7th') || grade === '7') return '7';
  if (grade.includes('8th') || grade === '8') return '8';
  if (grade.includes('9th') || grade === '9') return '9';
  if (grade.includes('10th') || grade === '10') return '10';
  if (grade.includes('11th') || grade === '11') return '11';
  if (grade.includes('12th') || grade === '12') return '12';
  
  // Return as-is if no mapping found
  return gradeLevel;
}