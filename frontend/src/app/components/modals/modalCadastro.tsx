import React, { useState } from "react";
import Image from "next/image";
import imgCadastro from "../../../../public/assets/document.png";
import imgFundo from "../../../../public/assets/crescer.png";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { login: string; senha: string; nome: string; empresa: string }) => void;
}

const CadastroModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");

    const handleSubmit = () => {
        if (!login || !senha || !nome) {
            setErro("Os campos login, senha e nome são obrigatórios!");
            return;
        }
        setErro("");
        onSubmit({ login, senha, nome, empresa });
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
                    <h2 className="text-2xl font-semibold text-white">Cadastrar Usuário</h2>
                    <button
                        onClick={onClose}
                        className="text-white font-bold bg-red-600 w-6 hover:text-white focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                {/* Imagem decorativa */}
                <div className="mb-6 flex justify-center">
                    <Image
                        src={imgCadastro}
                        alt="documentCadastro.png"
                        className="w-20 h-20 mb-4 animate__animated animate__pulse animate__infinite"
                    />
                </div>

                {erro && (
                    <div className="mb-4 text-red-500 font-medium">
                        {erro}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Login</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digite o login"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Senha</label>
                    <div className="relative">
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Digite sua senha"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-teal-500 text-sm focus:outline-none"
                        >
                            {mostrarSenha ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digite o nome"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">{"Empresa (opcional)"}</label>
                    <input
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digite o nome da empresa"
                    />
                </div>

                <div className="flex justify-between gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-5 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CadastroModal;
