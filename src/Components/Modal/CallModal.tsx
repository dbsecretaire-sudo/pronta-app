// src/Components/CallModal.tsx
"use client";
import { useState } from "react";
import { PhoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/src/Components";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onCall: (phoneNumber: string) => void;
}

export function CallModal({ 
  isOpen, 
  onClose, 
  // onCall 
}: CallModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      // onCall(phoneNumber);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Passer un appel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 0612345678"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="secondary">
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              <PhoneIcon className="h-5 w-5 mr-2" />
              Appeler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
