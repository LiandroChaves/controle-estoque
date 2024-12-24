import React, { useState } from "react";

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


    const handleSubmit = () => {
        onSubmit({ login, senha, nome, empresa });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Cadastrar Usuário</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Login
                    </label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={mostrarSenha ? "text" : "password"} 
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Digite sua senha"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((prev) => !prev)} 
                                className="absolute right-3 top-4 text-sm text-blue-600 hover:underline"
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Empresa
                    </label>
                    <input
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CadastroModal;
