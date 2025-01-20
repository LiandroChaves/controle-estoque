import React, { useState, useEffect } from "react";
import Image from "next/image";
import imgEstoque from "../../../public/assets/estoque.png";
import imgFundo from "../../../public/assets/crescer.png"; // Novo caminho da imagem de fundo

type AdicionarProdutoModalProps = {
    onClose: () => void;
    onProdutoAdicionado: (produto: any) => void; // Ajuste o tipo `any` conforme necessário
};

const AdicionarProdutoModal: React.FC<AdicionarProdutoModalProps> = ({ onClose, onProdutoAdicionado }) => {
    const [produto, setProduto] = useState({
        nome: "",
        categoria: "",
        subcategoria: "",
        estoque: "",
        preco: "",
        catalogo: "",
        favorito: false,
    });

    const [usuarioId, setUsuarioId] = useState<string | null>(null);

    const fetchUsuario = async (): Promise<string> => {
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
            return data.id; // Retorna o ID do usuário
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Erro ao buscar informações do usuário:", err.message);
            } else {
                console.error("Erro desconhecido:", err);
            }
            onClose();
            throw err;
        }
    };

    useEffect(() => {
        const obterUsuarioId = async () => {
            try {
                const id = await fetchUsuario();
                setUsuarioId(id);
            } catch (error) {
                console.error("Erro ao obter ID do usuário:", error);
            }
        };

        obterUsuarioId();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProduto({
            ...produto,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async () => {
        if (!usuarioId) {
            alert("ID do usuário não encontrado. Faça login novamente.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/produtos/${usuarioId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Produto adicionado com sucesso!");
                onProdutoAdicionado(data.produto);
                onClose();
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar produto.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate__animated animate__fadeIn animate__faster">
            <div
                className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-xl animate__animated animate__zoomIn animate__faster"
                style={{
                    backgroundImage: `url(${imgFundo.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">{`Adicionar Produto`}</h2>
                    <button
                        onClick={onClose}
                        className="text-white font-bold bg-red-600 w-6 hover:text-white focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-3">
                    <label className="block mb-1 text-white">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={produto.nome}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Categoria</label>
                    <input
                        type="text"
                        name="categoria"
                        value={produto.categoria}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Subcategoria</label>
                    <input
                        type="text"
                        name="subcategoria"
                        value={produto.subcategoria}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Estoque</label>
                    <input
                        type="number"
                        name="estoque"
                        value={produto.estoque}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        name="preco"
                        value={produto.preco}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 text-white">Catálogo</label>
                    <input
                        type="text"
                        name="catalogo"
                        value={produto.catalogo}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3 flex items-center">
                    <label className="mr-2 text-white">Favorito</label>
                    <input
                        type="checkbox"
                        name="favorito"
                        checked={produto.favorito}
                        onChange={handleChange}
                        className="h-5 w-5"
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
                        onClick={handleSubmit}
                        className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdicionarProdutoModal;
