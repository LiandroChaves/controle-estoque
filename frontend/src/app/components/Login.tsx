"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CadastroModal from "./modalCadastro";
import { useTheme } from "../../utils/context/ThemeContext";

export default function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, senha }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                setErro(errorData.error || "Credenciais inválidas");
                return;
            }

            const data = await response.json();
            console.log("Login bem-sucedido:", data);

            localStorage.setItem("token", data.token);

            router.push("/compras");
        } catch (error) {
            setErro("Erro ao conectar ao servidor");
            console.error("Erro:", error);
        }
    };

    const handleCadastro = async (data: { login: string; senha: string; nome: string; empresa: string }) => {
        try {
            const response = await fetch("http://localhost:5000/api/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao cadastrar usuário.");
            }

            const result = await response.json();
            alert(`Usuário cadastrado com sucesso: ${result.usuario.nome}`);
            setIsModalOpen(false); 
        } catch (error: any) {
            console.error("Erro ao cadastrar usuário:", error.message);
            alert(error.message);
        }
    };

    return (
        <>
            <div className={`flex items-center justify-center min-h-screen transition-all ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800"
                : "bg-gradient-to-br from-gray-100 via-teal-200 to-gray-300"
                }`}
            >
                <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all ${isDarkMode
                    ? "bg-gray-800 bg-opacity-90"
                    : "bg-gray-100 bg-opacity-95"
                    }`}
                >
                    <button
                        onClick={toggleTheme}
                        className={`p-2 relative left-[90%] rounded-lg font-bold transition-all ${isDarkMode

                            ? "bg-gray-500 text-teal-600 hover:bg-teal-500 hover:text-white"
                            : "bg-gray-500 text-teal-400 hover:bg-teal-500 hover:text-white"
                            }`}
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                    <h1 className={`text-3xl font-extrabold text-center mb-6 transition-all ${isDarkMode ? "text-teal-400" : "text-gray-600"
                        }`}
                    >
                        Bem-vindo!
                    </h1>

                    {erro && (
                        <div className="mb-4 text-sm text-red-600 bg-red-200 p-3 rounded-md shadow-md">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                htmlFor="login"
                                className={`block text-sm font-medium mb-2 transition-all ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                Login
                            </label>
                            <input
                                type="text"
                                id="login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg shadow-lg border-none transition-all
                                    ${isDarkMode 
                                        ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" 
                                        : "bg-gray-200 text-gray-900 placeholder-gray-500 focus:ring-teal-400 focus:border-teal-400"
                                    }`}
                                
                                placeholder="Digite seu login"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="senha" className={`block text-sm font-medium mb-2 transition-all ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    id="senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg shadow-lg border-none transition-all
                                        ${isDarkMode 
                                            ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500" 
                                            : "bg-gray-200 text-gray-900 placeholder-gray-500 focus:ring-teal-400 focus:border-teal-400"
                                        }`}
                                    
                                    placeholder="Digite sua senha"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha((prev) => !prev)}
                                    className={`absolute right-3 top-2.5 transition-all ${
                                        isDarkMode ? "text-teal-400 hover:underline" : "text-gray-600 hover:underline"
                                    }`}
                                    
                                >
                                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
                                isDarkMode 
                                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700" 
                                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
                            }`}
                            
                        >
                            Entrar
                        </button>
                    </form>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`mt-4 w-full py-3 transition-all duration-300 hover:underline ${
                            isDarkMode ? "text-teal-400 hover:text-teal-300" : "text-gray-600 hover:text-gray-500"
                        }`}
                        
                    >
                        Cadastrar-se
                    </button>
                </div>

                <CadastroModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCadastro}
                />
            </div>
        </>
    );
}
