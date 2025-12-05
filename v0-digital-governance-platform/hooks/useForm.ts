import { useState, useCallback } from 'react';
import { z, ZodTypeAny } from 'zod';

type FormErrors<T> = Partial<Record<keyof T, string>>;

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: z.ZodSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (valuesToValidate: T): boolean => {
      if (!validationSchema) return true;

      try {
        validationSchema.parse(valuesToValidate);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors = error.errors.reduce<FormErrors<T>>((acc, curr) => {
            const key = curr.path[0] as keyof T;
            acc[key] = curr.message;
            return acc;
          }, {});
          setErrors(newErrors);
        }
        return false;
      }
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target as HTMLInputElement;
      
      setValues((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    setErrors,
    setValues,
    validate: () => validate(values),
    handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => {
      return async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!validate(values)) return;
        
        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    resetForm,
  };
};

export default useForm;
