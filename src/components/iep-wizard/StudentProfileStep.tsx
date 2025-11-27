import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentProfileStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function StudentProfileStep({ data, onUpdate, jurisdiction }: StudentProfileStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={data.firstName || ''}
                onChange={(e) => updateData('firstName', e.target.value)}
                placeholder="Student's first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={data.lastName || ''}
                onChange={(e) => updateData('lastName', e.target.value)}
                placeholder="Student's last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth || ''}
                onChange={(e) => updateData('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={data.age || ''}
                onChange={(e) => updateData('age', e.target.value)}
                placeholder="Current age"
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade Level *</Label>
              <Select
                value={data.grade || ''}
                onValueChange={(value) => updateData('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-k">Pre-K</SelectItem>
                  <SelectItem value="k">Kindergarten</SelectItem>
                  <SelectItem value="1">1st Grade</SelectItem>
                  <SelectItem value="2">2nd Grade</SelectItem>
                  <SelectItem value="3">3rd Grade</SelectItem>
                  <SelectItem value="4">4th Grade</SelectItem>
                  <SelectItem value="5">5th Grade</SelectItem>
                  <SelectItem value="6">6th Grade</SelectItem>
                  <SelectItem value="7">7th Grade</SelectItem>
                  <SelectItem value="8">8th Grade</SelectItem>
                  <SelectItem value="9">9th Grade</SelectItem>
                  <SelectItem value="10">10th Grade</SelectItem>
                  <SelectItem value="11">11th Grade</SelectItem>
                  <SelectItem value="12">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="school">School *</Label>
            <Input
              id="school"
              value={data.school || ''}
              onChange={(e) => updateData('school', e.target.value)}
              placeholder="Current school name"
            />
          </div>

          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={data.studentId || ''}
              onChange={(e) => updateData('studentId', e.target.value)}
              placeholder="Student identification number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parent/Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentName">Parent/Guardian Name *</Label>
              <Input
                id="parentName"
                value={data.parentName || ''}
                onChange={(e) => updateData('parentName', e.target.value)}
                placeholder="Primary contact name"
              />
            </div>
            <div>
              <Label htmlFor="parentPhone">Phone Number</Label>
              <Input
                id="parentPhone"
                type="tel"
                value={data.parentPhone || ''}
                onChange={(e) => updateData('parentPhone', e.target.value)}
                placeholder="Contact phone number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parentEmail">Email Address</Label>
            <Input
              id="parentEmail"
              type="email"
              value={data.parentEmail || ''}
              onChange={(e) => updateData('parentEmail', e.target.value)}
              placeholder="Contact email address"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={data.address || ''}
              onChange={(e) => updateData('address', e.target.value)}
              placeholder="Home address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryLanguage">Primary Language Spoken at Home</Label>
            <Input
              id="primaryLanguage"
              value={data.primaryLanguage || ''}
              onChange={(e) => updateData('primaryLanguage', e.target.value)}
              placeholder="e.g., English, Spanish, etc."
            />
          </div>

          <div>
            <Label htmlFor="medicalInfo">Relevant Medical Information</Label>
            <Textarea
              id="medicalInfo"
              value={data.medicalInfo || ''}
              onChange={(e) => updateData('medicalInfo', e.target.value)}
              placeholder="Any medical conditions, medications, or health concerns relevant to education"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="previousServices">Previous Special Education Services</Label>
            <Textarea
              id="previousServices"
              value={data.previousServices || ''}
              onChange={(e) => updateData('previousServices', e.target.value)}
              placeholder="Describe any previous special education services, evaluations, or interventions"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}