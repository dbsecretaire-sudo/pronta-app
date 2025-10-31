import { CreateClient } from "./types";

export const validateClient = (client: Partial<CreateClient>): boolean => {
  return !!client.name && !!client.email;
};

export const formatClientForResponse = (client: any) => {
  return {
    ...client,
    created_at: client.created_at?.toISOString(),
    updated_at: client.updated_at?.toISOString(),
  };
};
