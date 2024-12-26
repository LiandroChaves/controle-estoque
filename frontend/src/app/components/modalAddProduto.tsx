import React, { useState, useEffect } from "react";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/2">
                <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>
                <div className="mb-3">
                    <label className="block mb-1">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={produto.nome}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Categoria</label>
                    <input
                        type="text"
                        name="categoria"
                        value={produto.categoria}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Subcategoria</label>
                    <input
                        type="text"
                        name="subcategoria"
                        value={produto.subcategoria}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Estoque</label>
                    <input
                        type="number"
                        name="estoque"
                        value={produto.estoque}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1">Preço</label>
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
                    <label className="block mb-1">Catálogo</label>
                    <input
                        type="text"
                        name="catalogo"
                        value={produto.catalogo}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="mb-3 flex items-center">
                    <label className="mr-2">Favorito</label>
                    <input
                        type="checkbox"
                        name="favorito"
                        checked={produto.favorito}
                        onChange={handleChange}
                        className="h-5 w-5"
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
                        onClick={handleSubmit}
                        className="border p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdicionarProdutoModal;
