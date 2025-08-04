
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useSecureInput = (initialValues: Record<string, string>, rules: ValidationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const sanitizeInput = useCallback((value: string): string => {
    // Remove potentially dangerous characters
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }, []);

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    const sanitizedValue = sanitizeInput(value);

    if (rule.required && !sanitizedValue) {
      return `${name} is required`;
    }

    if (rule.minLength && sanitizedValue.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
      return `${name} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
      return `${name} format is invalid`;
    }

    if (rule.custom) {
      return rule.custom(sanitizedValue);
    }

    return null;
  }, [rules, sanitizeInput]);

  const setValue = useCallback((name: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setValues(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  }, [sanitizeInput, validateField, touched]);

  const setTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name] || '');
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, [validateField, values]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach(name => {
      const error = validateField(name, values[name] || '');
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [rules, values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};
