import { z } from 'zod';
import FormInput from './FormInput';
import { AddressSchema } from '@/src/lib/schemas/clients';

interface FormAddressProps {
  label: string;
  value: z.infer<typeof AddressSchema>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof z.infer<typeof AddressSchema>, string>>;
}

const FormAddress = ({ label, value, onChange, errors = {} }: FormAddressProps) => {
  return (
    <div className="space-y-2">
      <h3 className="block text-sm font-medium text-gray-700 mb-1">{label}</h3>
      {(['street', 'city', 'state', 'postalCode', 'country'] as const).map((key) => (
        <FormInput
          key={key}
          label={key === 'postalCode' ? 'Code postal' :
                key === 'state' ? 'État/Région' :
                key.charAt(0).toUpperCase() + key.slice(1)}
          name={`address.${key}`}
          value={value[key] ?? ""}
          onChange={onChange}
          error={errors[key]}
          className="mb-2"
        />
      ))}
    </div>
  );
};

export default FormAddress;
