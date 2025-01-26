import React, { useState, useEffect } from "react";
import Image from "next/image";
import imgEstoque from "../../../public/assets/estoque.png";
import imgFundo from "../../../public/assets/crescer.png"; // Novo caminho da imagem de fundo
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AdicionarProdutoModalProps = {
    onClose: () => void;
    onProdutoAdicionado: (produto: any) => void; // Ajuste o tipo `any` conforme necessário
};

const AdicionarProdutoModal: React.FC<AdicionarProdutoModalProps> = ({ onClose, onProdutoAdicionado }) => {
    const [produto, setProduto] = useState({
        nome: "",
        descricao: "",
        categoria: "",
        subcategoria: "",
        estoque: "",
        preco: "",
        catalogo: "",
        imagem: "",
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

    const uploadImagem = async (file: File): Promise<string> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autenticado.');
    
            // Obtém o ID do usuário
            const produtoId = await fetchUsuario(); // Agora você já possui o produtoId
    
            const formData = new FormData();
            formData.append('image', file);
            formData.append('produtoId', produtoId); // Adiciona o produtoId ao formData
    
            const response = await fetch('http://localhost:5000/api/produto/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Recebe o erro como texto
                throw new Error(`Erro ao fazer upload: ${errorText}`);
            }
    
            const data = await response.json();
            return data.imagePath; // Caminho da imagem salva
        } catch (error: any) {
            console.error('Erro ao fazer upload da imagem:', error.message);
            throw error;
        }
    };
    

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
                onProdutoAdicionado(data.produto);
                onClose();
                toast.success(`Produto: ${produto.nome} adicionado com sucesso!`, {
                    position: "bottom-right",
                    autoClose: 3000
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
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
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgFundo.src})`,
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
                    <label className="h-2 block mb-1 text-white">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={produto.nome}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Descrição:</label>
                    <input
                        type="text"
                        name="descricao"
                        value={produto.descricao}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Categoria</label>
                    <input
                        type="text"
                        name="categoria"
                        value={produto.categoria}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Subcategoria</label>
                    <input
                        type="text"
                        name="subcategoria"
                        value={produto.subcategoria}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Estoque</label>
                    <input
                        type="number"
                        name="estoque"
                        value={produto.estoque}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        name="preco"
                        value={produto.preco}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Catálogo</label>
                    <input
                        type="text"
                        name="catalogo"
                        value={produto.catalogo}
                        onChange={handleChange}
                        className="h-8 relative top-3 border p-2 rounded w-full text-black"
                    />
                </div>
                <div className="mb-3">
                    <label className="h-2 block mb-1 text-white">Imagem</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                try {
                                    const imagePath = await uploadImagem(file); // Faz o upload da imagem e obtém o caminho
                                    setProduto((prevProduto) => ({
                                        ...prevProduto,
                                        imagem: imagePath, // Define o caminho da imagem no produto
                                    }));
                                } catch (error) {
                                    console.error("Erro ao fazer upload da imagem:", error);
                                }
                            }
                        }}
                        className="h-11 relative top-3 border p-2 rounded w-auto text-white"
                    />
                </div>

                <div className="mb-3 relative top-2 flex items-center">
                    <label className="mr-2 text-white">Favorito</label>
                    <input
                        type="checkbox"
                        name="favorito"
                        checked={produto.favorito}
                        onChange={handleChange}
                        className="h-5 w-5 text-black"
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
