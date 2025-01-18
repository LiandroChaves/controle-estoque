"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-xl font-bold mb-4">Adicionar ao Carrinho</h2>
                <div className="mb-3">
                    <label className="block mb-1">Nome do Produto</label>
                    <input
                        type="text"
                        value={produto.nome}
                        disabled
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Preço</label>
                    <input
                        type="text"
                        value={produto.preco}
                        disabled
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Quantidade</label>
                    <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value))}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="border p-2 rounded-lg mr-2 bg-gray-200 hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAdicionar}
                        className="border p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObterProdutoModal;
