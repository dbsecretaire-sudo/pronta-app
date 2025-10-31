import { forwardRef } from "react";
import { FormInputProps } from "@/models/Props";

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
