import { ClientFormData } from "./types";

// Validation du formulaire (déplacée depuis ClientForm.tsx)
export const validateClientForm = (formData: ClientFormData) => {
  const errors = {
    name: "",
    email: "",
  };

  if (!formData.name.trim()) {
    errors.name = "Le nom est obligatoire";
  }

  if (!formData.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "L'email n'est pas valide";
  }

  return {
    isValid: !errors.name && !errors.email,
    errors,
  };
};