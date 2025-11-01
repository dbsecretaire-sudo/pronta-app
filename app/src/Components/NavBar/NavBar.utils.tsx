// components/NavBar/NavBar.utils.ts
export const DEFAULT_LOGO_TEXT = "Pronta";

// Exemple de fonction utilitaire pour les icônes
export const renderIcon = (icon: string | React.ReactNode) => {
  return typeof icon === 'string' ? <span>{icon}</span> : icon;
};