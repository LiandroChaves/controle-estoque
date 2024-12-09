import React, { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    onSave?: () => void;
    saveButtonText?: string;
    showSaveButton?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title = "Título do Modal",
    children,
    onSave,
    saveButtonText = "Salvar",
    showSaveButton = true,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-6">{children}</div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancelar
                    </button>
                    {showSaveButton && (
                        <button
                            onClick={onSave}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            {saveButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
