"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CadastroModal from "./modalCadastro";

export default function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
    const router = useRouter();

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
            setIsModalOpen(false); // Fecha o modal após o cadastro
        } catch (error: any) {
            console.error("Erro ao cadastrar usuário:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800">
            <div className="relative w-full max-w-md p-6 bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-extrabold text-teal-400 text-center mb-6">
                    Bem-vindo!
                </h1>

                {erro && (
                    <div className="mb-4 text-sm text-red-600 bg-red-200 p-3 rounded-md shadow-md">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-2">
                            Login
                        </label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg focus:ring-teal-500 focus:border-teal-500 border-none placeholder-gray-400"
                            placeholder="Digite seu login"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg focus:ring-teal-500 focus:border-teal-500 border-none placeholder-gray-400"
                                placeholder="Digite sua senha"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha((prev) => !prev)}
                                className="absolute right-3 top-2.5 text-teal-400 hover:underline"
                            >
                                {mostrarSenha ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-teal-700 transform transition-all duration-300 hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 w-full py-3 text-teal-400 hover:text-teal-300 transition-all duration-300 hover:underline"
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
    );
}
