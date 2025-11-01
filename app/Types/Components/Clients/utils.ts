import { ClientFormData } from "./types";

// Validation du formulaire (déplacée depuis ClientForm.tsx)
export const validateClientForm = (formData: ClientFormData) => {
  const errors = {
    name: !formData.name ? "Le nom est obligatoire" : "",
    email: !formData.email ? "L'email est obligatoire" : "",
  };
  
  return {
    isValid: !errors.name && !errors.email,
    errors,
  };
};