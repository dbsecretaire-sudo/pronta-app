import { resourcesConfig } from '@/src/lib/admin/resources';

export const getTableColumns = (resource: string) => {
  return resourcesConfig[resource] || [];
};