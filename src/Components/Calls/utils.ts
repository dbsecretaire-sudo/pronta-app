export const formatDuration = (duration?: number): string => {
  if (!duration) return "--";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes} min ${seconds} s`;
};

// Exemple d'autre utilitaire :
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleString();
};