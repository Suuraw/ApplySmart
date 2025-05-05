import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ErrorPopupProps {
  message: string;
  onClose: (visible: boolean) => void;
  isVisible: boolean;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose, isVisible }) => {
  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-red-600">Error</h2>
            <Button
              variant="ghost"
              onClick={() => onClose(false)}
              className="text-red-600 hover:bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-4 text-red-600">{message}</p>
          <div className="mt-6 text-right">
            <Button variant="outline" onClick={() => onClose(false)}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default ErrorPopup;
