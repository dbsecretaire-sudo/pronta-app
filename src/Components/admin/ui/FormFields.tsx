// src/components/admin/ui/Form.tsx
"use client";
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { Button } from '@/src/Components';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface AdminFormProps<T> {
  fields: FormField[];
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void>;
  submitText?: string;
}

export function AdminForm<T extends FieldValues>({
  fields,
  defaultValues,
  onSubmit,
  submitText = 'Enregistrer',
}: AdminFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1">
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    {...register(field.name as any, { required: field.required })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    {...register(field.name as any, { required: field.required })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
                {errors[field.name as any] && (
                  <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? 'Enregistrement...' : submitText}
        </Button>
      </div>
    </form>
  );
}
