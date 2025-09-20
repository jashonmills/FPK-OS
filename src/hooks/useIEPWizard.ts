import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { mapStudentToIEPData } from '@/utils/iepDataMapping';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  required: boolean;
}

type JurisdictionType = 'US_IDEA' | 'IE_EPSEN';

export function useIEPWizard(orgId: string, studentId?: string) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<number, any>>({});
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>('US_IDEA');
  const [isSaving, setIsSaving] = useState(false);
  const [wizardId, setWizardId] = useState<string | null>(null);

  // Fetch student data if studentId is provided
  const { students } = useOrgStudents(orgId, undefined);
  const studentData = studentId ? students.find(s => s.id === studentId) : null;

  // Get steps based on jurisdiction
  const [steps, setSteps] = useState<WizardStep[]>([]);

  useEffect(() => {
    // Use hardcoded steps for now - can be enhanced later with database storage
    const getStepsForJurisdiction = (jurisdiction: JurisdictionType): WizardStep[] => {
      if (jurisdiction === 'IE_EPSEN') {
        return [
          { id: 1, title: "Student Profile", description: "Basic student information and demographics", required: true },
          { id: 2, title: "Jurisdiction & Consent", description: "EPSEN framework and required consents", required: true },
          { id: 3, title: "Concerns & Referral", description: "Primary concerns and referral reasons", required: true },
          { id: 4, title: "SEN Determination", description: "Special Educational Need assessment", required: true },
          { id: 5, title: "Present Levels", description: "Current performance across all domains", required: true },
          { id: 6, title: "Learning Targets", description: "Individual learning objectives", required: true },
          { id: 7, title: "Support Allocation", description: "SET/SNA and therapeutic supports", required: true },
          { id: 8, title: "Continuum of Support", description: "Support model and resource allocation", required: true },
          { id: 9, title: "Transition Planning", description: "Junior/Senior Cycle planning", required: false },
          { id: 10, title: "Assessment Participation", description: "RACE/SEC accommodations", required: true },
          { id: 11, title: "Family & Student Input", description: "Family priorities and student voice", required: true },
          { id: 12, title: "Progress Monitoring", description: "Data collection and reporting plan", required: true },
          { id: 13, title: "Review & Finalize", description: "Final review and decision letter", required: true }
        ];
      } else {
        return [
          { id: 1, title: "Student Profile", description: "Basic student information and demographics", required: true },
          { id: 2, title: "Jurisdiction & Consent", description: "Legal framework and required consents", required: true },
          { id: 3, title: "Concerns & Referral", description: "Primary concerns and referral reasons", required: true },
          { id: 4, title: "Screening & Eligibility", description: "Formal evaluations and eligibility determination", required: true },
          { id: 5, title: "Present Levels", description: "Current performance across all domains", required: true },
          { id: 6, title: "Goals & Objectives", description: "SMART goals with measurable objectives", required: true },
          { id: 7, title: "Services & Supports", description: "Special education and related services", required: true },
          { id: 8, title: "LRE & Placement", description: "Least Restrictive Environment analysis", required: true },
          { id: 9, title: "Transition Planning", description: "Post-school planning (age 14-16+)", required: false },
          { id: 10, title: "Assessment Participation", description: "State testing and accommodations", required: true },
          { id: 11, title: "Parent & Student Input", description: "Family priorities and student voice", required: true },
          { id: 12, title: "Progress Monitoring", description: "Data collection and reporting plan", required: true },
          { id: 13, title: "Review & Finalize", description: "Final review and signatures", required: true }
        ];
      }
    };

    setSteps(getStepsForJurisdiction(jurisdiction));
  }, [jurisdiction]);

  // Load existing wizard data from localStorage and pre-populate with student data
  useEffect(() => {
    const loadWizardData = () => {
      try {
        const saved = localStorage.getItem(`iep-wizard-${orgId}`);
        let initialFormData = {};
        
        if (saved) {
          const savedData = JSON.parse(saved);
          setCurrentStep(savedData.currentStep || 1);
          initialFormData = savedData.formData || {};
          setJurisdiction(savedData.jurisdiction || 'US_IDEA');
        }

        // Pre-populate Step 1 with student data if available and Step 1 is empty
        if (studentData && (!initialFormData[1] || Object.keys(initialFormData[1]).length === 0)) {
          const mappedData = mapStudentToIEPData(studentData);
          initialFormData[1] = mappedData;
        }

        setFormData(initialFormData);
        setWizardId(`wizard-${orgId}-${Date.now()}`);
      } catch (error) {
        console.error('Error loading wizard data:', error);
        setWizardId(`wizard-${orgId}-${Date.now()}`);
      }
    };

    loadWizardData();
  }, [orgId, studentData]);

  // Remove the createNewWizard function as we're using localStorage

  const updateFormData = useCallback((step: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  }, []);

  const saveProgress = useCallback(async () => {
    if (!wizardId) return;

    setIsSaving(true);
    try {
      localStorage.setItem(`iep-wizard-${orgId}`, JSON.stringify({
        currentStep,
        formData,
        jurisdiction
      }));
      toast.success('Progress saved');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  }, [wizardId, currentStep, formData, jurisdiction, orgId]);

  const nextStep = useCallback(async () => {
    // Auto-save before moving to next step
    await saveProgress();

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the wizard
      await completeWizard();
    }
  }, [currentStep, steps.length, saveProgress]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const completeWizard = async () => {
    if (!wizardId) return;

    try {
      localStorage.removeItem(`iep-wizard-${orgId}`);
      toast.success('IEP Builder completed successfully!');
      
      // Return to student profile if studentId was provided, otherwise go to IEP module
      if (studentId) {
        navigate(`/org/${orgId}/students/${studentId}`);
      } else {
        navigate(`/org/${orgId}/iep`);
      }
    } catch (error) {
      console.error('Error completing wizard:', error);
      toast.error('Failed to complete IEP wizard');
    }
  };

  const progress = (currentStep / steps.length) * 100;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  return {
    currentStep,
    formData,
    steps,
    jurisdiction,
    setJurisdiction,
    updateFormData,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    progress,
    saveProgress,
    isSaving,
    completeWizard
  };
}