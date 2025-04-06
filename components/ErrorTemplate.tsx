import React from 'react';
import { X } from 'lucide-react';

interface ErrorPopupProps {
  message: string;
  onClose: (isVisible: boolean) => void;
  isVisible: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-16 right-4 flex items-center bg-white border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
      <span className="mr-2">{message}</span>
      <button
        onClick={()=>onClose(false)}
        className="text-red-700 hover:text-red-900 transition-colors duration-200"
        aria-label="Close error message"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ErrorPopup;