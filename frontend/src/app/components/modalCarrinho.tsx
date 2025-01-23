"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import imgFundo from "../../../public/assets/comprar-online.png";


type Produto = {
    nome: string;
    preco: string;
    id: number; // Incluindo código do produto
};

type ModalProps = {
    produto: Produto;
    onClose: () => void;
    onAdicionarCarrinho: (produto: Produto & { quantidade: number }) => void;
};

const ObterProdutoModal: React.FC<ModalProps> = ({ produto, onClose, onAdicionarCarrinho }) => {
    const [quantidade, setQuantidade] = useState(1);
    const router = useRouter();

    const fetchUsuario = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                throw new Error("Usuário não autenticado. Faça login novamente.");
            }

            const response = await fetch("http://localhost:5000/api/login", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao buscar informações do usuário");
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            console.error("Erro ao buscar informações do usuário:", err.message);
            router.push("/login");
            throw err;
        }
    };

    const handleAdicionar = async () => {
        if (!quantidade || quantidade <= 0) {
            alert("A quantidade deve ser maior que zero.");
            return;
        }

        if (!produto.id) { // Agora verificamos 'id'
            alert("O ID do produto é obrigatório.");
            return;
        }

        try {
            const usuario = await fetchUsuario();
            const usuarioId = usuario.id;

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Você precisa estar autenticado para realizar a compra.");
                return;
            }

            const resposta = await fetch(`http://localhost:5000/api/compras/${usuarioId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantidade: quantidade,
                    id: produto.id, // Altere 'cod_produto' para 'id'
                }),                
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert("Compra realizada com sucesso!");
                onAdicionarCarrinho({ ...produto, quantidade });
                window.location.reload()
            } else {
                alert(dados.error || "Erro ao realizar a compra");
            }
        } catch (err) {
            console.error("Erro ao realizar a compra:", err);
            alert("Erro ao realizar a compra");
        }

        onClose();
    };    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate__animated animate__fadeIn animate__faster">
            <div
                className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-xl animate__animated animate__zoomIn animate__faster"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${imgFundo.src})`,
                    backgroundSize: "540px",
                    backgroundPosition: "top",
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">{`Adicionar ao Carrinho`}</h2>
                    <button
                        onClick={onClose}
                        className="text-white font-bold bg-red-600 w-6 hover:text-white focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-3">
                    <label className="block mb-1 text-white">Nome do Produto</label>
                    <input
                        type="text"
                        value={produto.nome}
                        disabled
                        className="border p-2 rounded w-full bg-gray-100 text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Preço</label>
                    <input
                        type="text"
                        value={produto.preco}
                        disabled
                        className="border p-2 rounded w-full bg-gray-100 text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Quantidade</label>
                    <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value))}
                        className="border p-2 rounded w-full text-black"
                    />
                </div>

                {/* Botões de ação */}
                <div className="flex justify-between gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAdicionar}
                        className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObterProdutoModal;
