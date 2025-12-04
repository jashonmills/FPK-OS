import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'radio';
    options?: string[];
    required?: boolean;
  }>;
}

const DEFAULT_FORM_SECTIONS: FormSection[] = [
  {
    id: 'student_info',
    title: 'Student Information',
    description: 'Basic information about your child',
    fields: [
      { id: 'student_name', label: 'Student Full Name', type: 'text', required: true },
      { id: 'grade', label: 'Current Grade', type: 'text', required: true },
      { id: 'school', label: 'Current School', type: 'text', required: true },
      { id: 'birthdate', label: 'Date of Birth', type: 'text', required: true }
    ]
  },
  {
    id: 'strengths',
    title: 'Student Strengths',
    description: 'Tell us about your child\'s strengths and abilities',
    fields: [
      { id: 'academic_strengths', label: 'Academic Strengths', type: 'textarea', required: true },
      { id: 'social_strengths', label: 'Social/Behavioral Strengths', type: 'textarea', required: true },
      { id: 'interests', label: 'Interests and Hobbies', type: 'textarea', required: true }
    ]
  },
  {
    id: 'challenges',
    title: 'Areas of Concern',
    description: 'Share your concerns and challenges',
    fields: [
      { id: 'academic_challenges', label: 'Academic Challenges', type: 'textarea', required: true },
      { id: 'behavioral_concerns', label: 'Behavioral Concerns', type: 'textarea' },
      { id: 'social_challenges', label: 'Social Challenges', type: 'textarea' }
    ]
  },
  {
    id: 'goals',
    title: 'Goals and Expectations',
    description: 'What are your hopes for your child\'s education?',
    fields: [
      { id: 'short_term_goals', label: 'Short-term Goals (this year)', type: 'textarea', required: true },
      { id: 'long_term_goals', label: 'Long-term Goals (future)', type: 'textarea', required: true },
      { id: 'parent_concerns', label: 'Specific Concerns to Address', type: 'textarea' }
    ]
  }
];

export default function ParentIEPAccess() {
  const { code } = useParams<{ code: string }>();
  const [sessionValid, setSessionValid] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    validateInviteCode();
  }, [code]);

  const validateInviteCode = async () => {
    if (!code) return;

    try {
      const { data, error } = await supabase.functions.invoke('validate-iep-code', {
        body: { code }
      });

      if (error) throw error;

      if (data.valid) {
        setSessionValid(true);
        setSessionId(data.sessionId);
      } else {
        toast.error('Invalid or expired invite code');
      }
    } catch (error) {
      console.error('Error validating invite code:', error);
      toast.error('Failed to validate invite code');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (sectionId: string, fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
  };

  const saveSection = async () => {
    const section = DEFAULT_FORM_SECTIONS[currentSection];
    const sectionData = formData[section.id] || {};

    try {
      const { error } = await supabase.functions.invoke('save-iep-data', {
        body: {
          sessionId,
          sectionId: section.id,
          formData: sectionData
        }
      });

      if (error) throw error;
      toast.success('Section saved successfully');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
    }
  };

  const nextSection = async () => {
    await saveSection();
    if (currentSection < DEFAULT_FORM_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const submitForm = async () => {
    await saveSection();
    
    try {
      const { error } = await supabase.functions.invoke('complete-iep-session', {
        body: { sessionId }
      });

      if (error) throw error;
      
      toast.success('IEP preparation form submitted successfully!');
    } catch (error) {
      console.error('Error completing IEP session:', error);
      toast.error('Failed to submit form');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Validating access code...</p>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              The invite code is invalid or has expired. Please contact your child's school for a new code.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const currentFormSection = DEFAULT_FORM_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / DEFAULT_FORM_SECTIONS.length) * 100;
  const isLastSection = currentSection === DEFAULT_FORM_SECTIONS.length - 1;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">IEP Preparation Form</h1>
          <p className="text-muted-foreground text-center">
            Help us prepare for your child's IEP meeting
          </p>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              Section {currentSection + 1} of {DEFAULT_FORM_SECTIONS.length}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentFormSection.title}</CardTitle>
            <CardDescription>{currentFormSection.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentFormSection.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    value={formData[currentFormSection.id]?.[field.id] || ''}
                    onChange={(e) => updateFormData(currentFormSection.id, field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[currentFormSection.id]?.[field.id] || ''}
                    onChange={(e) => updateFormData(currentFormSection.id, field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {isLastSection ? (
            <Button onClick={submitForm}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Form
            </Button>
          ) : (
            <Button onClick={nextSection}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}