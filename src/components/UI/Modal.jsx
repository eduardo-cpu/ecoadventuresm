import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg z-10">
                <div className="p-4">
                    {children}
                </div>
                <div className="p-4 border-t">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;