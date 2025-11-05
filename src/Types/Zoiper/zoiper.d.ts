export {};

declare global {
  interface Window {
    ZoiperAPI: {
      call: (phoneNumber: string) => void;
      // Ajoutez d'autres méthodes de l'API Zoiper si nécessaire
      onCallStateChange?: (callback: (state: any) => void) => void;
      getVersion?: () => string;
      // etc.
    };
  }
}