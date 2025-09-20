import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  required: boolean;
}

type JurisdictionType = 'US_IDEA' | 'IE_EPSEN';

export function useIEPWizard(orgId: string) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<number, any>>({});
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>('US_IDEA');
  const [isSaving, setIsSaving] = useState(false);
  const [wizardId, setWizardId] = useState<string | null>(null);

  // Get steps based on jurisdiction
  const [steps, setSteps] = useState<WizardStep[]>([]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const { data, error } = await supabase.rpc('get_iep_wizard_steps', {
          p_jurisdiction: jurisdiction
        });

        if (error) throw error;
        setSteps(data || []);
      } catch (error) {
        console.error('Error fetching wizard steps:', error);
        // Fallback steps
        setSteps([
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
        ]);
      }
    };

    fetchSteps();
  }, [jurisdiction]);

  // Load existing wizard data
  useEffect(() => {
    const loadWizardData = async () => {
      try {
        const { data, error } = await supabase
          .from('iep_wizards')
          .select('*')
          .eq('org_id', orgId)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setWizardId(data.id);
          setCurrentStep(data.current_step);
          setFormData(data.form_data || {});
          setJurisdiction(data.jurisdiction as JurisdictionType);
        }
      } catch (error) {
        console.error('Error loading wizard data:', error);
        // Create new wizard
        createNewWizard();
      }
    };

    loadWizardData();
  }, [orgId]);

  const createNewWizard = async () => {
    try {
      const { data, error } = await supabase
        .from('iep_wizards')
        .insert({
          org_id: orgId,
          current_step: 1,
          jurisdiction,
          form_data: {},
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setWizardId(data.id);
    } catch (error) {
      console.error('Error creating wizard:', error);
      toast.error('Failed to initialize IEP wizard');
    }
  };

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
      const { error } = await supabase
        .from('iep_wizards')
        .update({
          current_step: currentStep,
          form_data: formData,
          jurisdiction,
          updated_at: new Date().toISOString()
        })
        .eq('id', wizardId);

      if (error) throw error;
      toast.success('Progress saved');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  }, [wizardId, currentStep, formData, jurisdiction]);

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
      const { error } = await supabase
        .from('iep_wizards')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          form_data: formData
        })
        .eq('id', wizardId);

      if (error) throw error;

      toast.success('IEP Builder completed successfully!');
      navigate(`/org/${orgId}/iep`);
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
    isSaving
  };
}