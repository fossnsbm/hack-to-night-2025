"use client";

import Modal from './Modal';

type RegistrationSuccessModalProps = {
  isOpen: boolean;
  teamName: string;
  onClose: () => void;
  onDashboard?: () => void;
};
//irushi
export default function RegistrationSuccessModal({
  isOpen,
  teamName,
  onClose,
  onDashboard
}: RegistrationSuccessModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      showCloseButton={false}
    >
      <div className="pt-8 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6 inline-block">
          <p className="text-gray-400 text-sm mb-1">Team Name</p>
          <p className="text-cyan-400 font-bold text-xl">{teamName}</p>
        </div>
        
        <p className="text-gray-300 mb-6">
          Your team has been successfully registered for Hackto Night 2025! Please log in with your team leader's email and password to access your team account when the contest starts.
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
} 