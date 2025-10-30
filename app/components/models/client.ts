export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export const emptyClient: ClientFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  company: ""
};
