import React, { ReactNode } from "react";
import Image from "next/image";
import imgEstoque from "../../../../public/assets/estoque.png";
import imgFundo from "../../../../public/assets/crescer.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    const handleSave = async () => {
        if (onSave) {
            await onSave();
            toast.success("Alterações salvas com sucesso!", {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn animate__faster">
            <div
                className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-xl border-t-4 border-teal-500 animate__animated animate__zoomIn animate__faster"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgFundo.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white font-bold bg-red-600 w-6 hover:text-white focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>
                <div className="mb-6 flex justify-center">
                    <Image
                        src={imgEstoque}
                        alt="Finances"
                        className="w-20 h-20 mb-4 animate__animated animate__pulse animate__infinite"
                    />
                </div>
                <div className="mb-6 text-gray-700">{children}</div>
                <div className="flex justify-between gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-5 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cancelar
                    </button>
                    {showSaveButton && (
                        <button
                            onClick={handleSave}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            {saveButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
