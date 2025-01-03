import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title?: string;
    description?: string;
    date?: string;
    picture?: string;
    location?: string;
    duration?: string;
    contact?: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-4">{content.title || "No Title"}</h1>
        {content.picture && (
          <img
            src={content.picture}
            alt={content.title}
            className="w-full h-auto rounded-md my-4"
          />
        )}
        <p className="mb-2">{content.description || "No description available."}</p>
        <p className="mb-2"><strong>Date:</strong> {content.date || "N/A"}</p>
        <p className="mb-2"><strong>Location:</strong> {content.location || "N/A"}</p>
        <p className="mb-2"><strong>Duration:</strong> {content.duration || "N/A"}</p>
        <p className="mb-2"><strong>Contact:</strong> {content.contact || "N/A"}</p>
      </div>
    </div>
  );
};

export default Modal;
