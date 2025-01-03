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

            router.push("/produtos");
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h1>

                {erro && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                            Login
                        </label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Digite seu login"
                            required
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

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Entrar
                    </button>
                </form>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 w-full px-4 py-2 text-blue-600 hover:scale-105 transition-transform duration-200"
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
