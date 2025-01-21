"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useRouter } from "next/navigation";
import Modal from "./modalEditar";
import logoEditar from '../../../public/assets/caneta.png'
import logoDeletar from '../../../public/assets/excluir.png'
import Footer from "./Footer";
import AdicionarProdutoModal from "./modalAddProduto";

export default function Produtos() {
    type Produto = {
        id?: number;
        nome: string;
        categoria: string;
        subcategoria?: string;
        estoque: number;
        preco: number;
        catalogo: string;
        favorito: boolean;
    };


    // ================================ States ================================
    const [produtos, setProdutos] = useState<any[]>([]);
    const [buscarTermo, setBuscarTermo] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
    const [produtosBuscados, setProdutosBuscados] = useState(produtos);
    const [infor, setInfor] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalAbertoin, setModalAbertoin] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
    const [mostrarFavoritos, setMostrarFavoritos] = useState(false);


    // ================================ Categorias ============================
    const [categorias, setCategorias] = useState<string[]>([]);
    const [subcategorias, setSubCategorias] = useState<string[]>([]);

    const fetchCategorias = async () => {
        try {
            const usuario = await fetchUsuario(); // Função que retorna as informações do usuário
            const userId = usuario?.id;

            if (!userId) {
                throw new Error('ID do usuário não encontrado.');
            }

            const response = await fetch(`http://localhost:5000/api/categorias?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
            }

            const dados = await response.json();
            const categorias = dados.map((item: { categoria: string }) => item.categoria);

            setCategorias(categorias);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategorias(); // Chama a função ao montar o componente
    }, []);

    const fetchSubcategorias = async () => {
        try {
            const usuario = await fetchUsuario(); // Função que retorna as informações do usuário
            const userId = usuario?.id;

            if (!userId) {
                throw new Error('ID do usuário não encontrado.');
            }

            const response = await fetch(`http://localhost:5000/api/subcategorias?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
            }

            const dados = await response.json();
            const subcategorias = dados.map((item: { subcategoria: string }) => item.subcategoria);

            setSubCategorias(subcategorias);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchSubcategorias(); // Chama a função ao montar o componente
    }, []);


    // ============================== Dados Contadores ========================
    const prodsCadastrados = [
        {
            quantProd: `${produtos.length} produtos cadastrados`,
        },
    ];

    // ========================== Função para carregar produtos ==================

    const fetchUsuario = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token || token === 'undefined') {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar informações do usuário');
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            console.error('Erro ao buscar informações do usuário:', err.message);
            router.push('/login');
            throw err;
        }
    };



    const handleAbrirModal = () => setModalAbertoin(true);
    const handleFecharModal = () => setModalAbertoin(false);

    const handleProdutoAdicionado = (produto: Produto) => {
        console.log("Produto adicionado:", produto);
    };


    const funcaoSair = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };



    const carregarProdutos = async () => {
        try {
            const data = await fetchUsuario();
            const endpoint = mostrarFavoritos ? `http://localhost:5000/api/produtos/favoritos/${data.id}` : `http://localhost:5000/api/produtos/${data.id}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }

            const dados = await response.json();
            setProdutos(dados);
            setProdutosBuscados(dados);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };


    useEffect(() => {
        carregarProdutos();
    }, []);

    // ============================== Aplicar Filtros ============================
    const aplicarFiltros = () => {
        if (
            buscarTermo.trim() === "" &&
            categoriaSelecionada === "" &&
            subcategoriaSelecionada === ""
        ) {
            setProdutosBuscados(produtos);
            return;
        }

        const termo = buscarTermo.toLowerCase();
        const filtrado = produtos.filter((produto) => {
            const correspondeCategoria =
                categoriaSelecionada === "" || produto.categoria === categoriaSelecionada;
            const correspondeSubcategoria =
                subcategoriaSelecionada === "" || produto.subcategoria === subcategoriaSelecionada;
            const correspondeBusca =
                termo === "" ||
                produto.nome.toLowerCase().includes(termo)

            return correspondeCategoria && correspondeSubcategoria && correspondeBusca;
        });
        setProdutosBuscados(filtrado);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [buscarTermo, categoriaSelecionada, subcategoriaSelecionada]);

    // ======================== Funções do Modal ================================
    const abrirModal = (produto: any) => {
        setProdutoSelecionado(produto);
        setModalAberto(true);
    };

    const salvarAlteracoes = async () => {
        if (!produtoSelecionado || !produtoSelecionado.id) return;

        // Verificar se os campos necessários existem
        const { nome, categoria, subcategoria, estoque, preco } = produtoSelecionado;
        if (!nome || !categoria || !subcategoria || estoque === undefined || preco === undefined) {
            console.error('Faltam campos obrigatórios para atualização');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/produtos/${produtoSelecionado.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(produtoSelecionado),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao salvar alterações");
            }

            const data = await response.json();
            console.log("Produto atualizado:", data);

            carregarProdutos();
            setModalAberto(false);
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
        }
    };

    const alternarFavoritos = async () => {
        setMostrarFavoritos((prevState) => !prevState); // Atualiza o estado

        try {
            const data = await fetchUsuario();
            const novoEstado = !mostrarFavoritos; // Calcula o novo estado manualmente
            const endpoint = novoEstado
                ? `http://localhost:5000/api/produtos/favoritos/${data.id}`
                : `http://localhost:5000/api/produtos/${data.id}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Erro ao buscar produtos");
            }

            const dados = await response.json();
            setProdutos(dados);
            setProdutosBuscados(dados);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };


    // ==================== Informações do Usuário ==============================
    const router = useRouter();

    useEffect(() => {
        const fetchInformacoes = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token || token === "undefined") {
                    setError("Usuário não autenticado. Faça login novamente.");
                    router.push("/login");
                    return;
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
                setInfor([data]);
            } catch (err: any) {
                console.error("Erro ao buscar informações do usuário:", err.message);
                setError(err.message);
            }
        };

        fetchInformacoes();
    }, [router]);

    const deletarProduto = async (produto: any) => {
        if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
            if (!produto || !produto.id) return;

            console.log(`Deletando produto com ID: ${produto.id}`);

            try {
                const response = await fetch(
                    `http://localhost:5000/api/produtos/${produto.id}`,
                    { method: "DELETE" }
                );

                if (!response.ok) {
                    throw new Error("Erro ao deletar produto!");
                }

                console.log("Produto deletado com sucesso.");
                window.location.reload();
                carregarProdutos();
            } catch (error) {
                console.error("Erro ao deletar produto:", error);
            }
        }
    };


    // ============================= Renderização ===============================
    return (
        <>
            <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-lg py-6">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <h1 className="text-4xl font-bold text-teal-400 flex items-center gap-4">
                        EasyControl
                        <span className="text-lg font-medium bg-teal-500 text-gray-900 px-3 py-1 rounded-full shadow-md">
                            Estoque
                        </span>
                    </h1>
                    <div className="flex items-center gap-8">
                        {prodsCadastrados.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-teal-400 bg-gray-700 px-4 py-2 rounded-lg shadow-md"
                            >
                                <h1 className="text-lg font-semibold">Produtos:</h1>
                                <p className="text-xl font-bold">{item.quantProd}</p>
                            </div>
                        ))}
                        {infor.length > 0 ? (
                            infor.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-gray-700 rounded-lg shadow-lg px-4 py-2">
                                    <Image
                                        src={ftPerfil}
                                        alt="perfil"
                                        width={50}
                                        height={50}
                                        className="rounded-full border border-teal-500"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-teal-400 font-bold">Nome: {item.nome}</p>
                                        <p className="text-gray-400 font-medium">Empresa: {item.empresa}</p>
                                    </div>
                                    <p
                                        onClick={funcaoSair}
                                        className="ml-4 text-red-500 font-bold cursor-pointer hover:underline"
                                    >
                                        Sair
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">Nenhuma informação disponível.</p>
                        )}
                    </div>
                </div>
            </header>

            <nav className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shadow-md py-4">
                <div className="container mx-auto flex items-center gap-8 px-6">
                    <select
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        className="bg-gray-600 text-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-teal-500"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria, index) => (
                            <option key={index} value={categoria}>
                                {categoria}
                            </option>
                        ))}
                    </select>
                    <select
                        value={subcategoriaSelecionada}
                        onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
                        className="bg-gray-600 text-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-teal-500"
                    >
                        <option value="">Selecione uma subcategoria</option>
                        {subcategorias.map((subcategoria, index) => (
                            <option key={index} value={subcategoria}>
                                {subcategoria}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={alternarFavoritos}
                        className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                    >
                        {mostrarFavoritos ? "Mostrar Todos" : "Favoritos"}
                    </button>
                    <button
                        onClick={() => router.push("/compras")}
                        className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                    >
                        Compras
                    </button>
                    <button
                        onClick={() => router.push("/vendas")}
                        className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                    >
                        Carrinho
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        {produtosBuscados.length === 0 && (
                            <p className="text-gray-400">Nenhum produto encontrado</p>
                        )}
                        <input
                            type="text"
                            placeholder="Pesquisar por nome"
                            value={buscarTermo}
                            onChange={(e) => setBuscarTermo(e.target.value)}
                            className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg shadow-md focus:ring-teal-500"
                        />
                    </div>
                </div>
            </nav>

            <main
                className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 min-h-screen px-6 py-12 text-gray-300"
            >
                <div className="flex justify-center mb-6">
                    <button
                        onClick={handleAbrirModal}
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-500 transform hover:scale-105 transition-all"
                    >
                        Adicionar Produto
                    </button>
                    {modalAbertoin && (
                        <AdicionarProdutoModal
                            onClose={handleFecharModal}
                            onProdutoAdicionado={handleProdutoAdicionado}
                        />
                    )}
                </div>
                <table className="w-full text-left border-collapse shadow-lg bg-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-800 text-teal-400">
                            {["Produto", "Categoria", "Subcategoria", "Estoque", "Preço", "Editar", "Deletar"].map(
                                (header, index) => (
                                    <th key={index} className="p-4 border-b border-gray-600 text-center">
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {produtosBuscados.map((produto, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-600 transition-all duration-200"
                            >
                                <td className="p-4 border-b border-gray-600 text-center">
                                    {produto.favorito && (
                                        <span className="text-yellow-400 mr-2" title="Favorito">
                                            ★
                                        </span>
                                    )}
                                    {produto.nome}
                                </td>
                                <td className="p-4 border-b border-gray-600 text-center">{produto.categoria}</td>
                                <td className="p-4 border-b border-gray-600 text-center">{produto.subcategoria}</td>
                                <td className="p-4 border-b border-gray-600 text-center">{produto.estoque}</td>
                                <td className="p-4 border-b border-gray-600 text-center">{produto.preco} R$</td>
                                <td className="p-4 border-b border-gray-600 text-center">
                                    <button onClick={() => abrirModal(produto)}>
                                        <Image
                                            src={logoEditar}
                                            alt="editar"
                                            width={40}
                                            height={40}
                                            className="invert"
                                        />
                                    </button>
                                </td>
                                <td className="p-4 border-b border-gray-600 text-center">
                                    <button onClick={() => deletarProduto(produto)}>
                                        <Image
                                            src={logoDeletar}
                                            alt="deletar"
                                            width={40}
                                            height={40}
                                            className="invert"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>


            <Modal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                title="Editar Produto"
                onSave={salvarAlteracoes}
                saveButtonText="Salvar Alterações"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="nome" className="w-32 text-white">Produto:</label>
                        <input
                            id="nome"
                            type="text"
                            value={produtoSelecionado?.nome || ""}
                            onChange={(e) =>
                                setProdutoSelecionado({
                                    ...produtoSelecionado,
                                    nome: e.target.value,
                                })
                            }
                            className="border p-2 rounded-md w-full"
                            placeholder="Nome do Produto"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="categoria" className="w-32 text-white">Categoria:</label>
                        <select
                            id="categoria"
                            value={produtoSelecionado?.categoria || ""}
                            onChange={(e) =>
                                setProdutoSelecionado({
                                    ...produtoSelecionado,
                                    categoria: e.target.value,
                                })
                            }
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="" disabled>
                                Selecione uma Categoria
                            </option>
                            {categorias.map((categoria, index) => (
                                <option key={index} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="subcategoria" className="w-32 text-white">Subcategoria:</label>
                        <select
                            id="subcategoria"
                            value={produtoSelecionado?.subcategoria || ""}
                            onChange={(e) =>
                                setProdutoSelecionado({
                                    ...produtoSelecionado,
                                    subcategoria: e.target.value,
                                })
                            }
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="" disabled>
                                Selecione uma Subcategoria
                            </option>
                            {subcategorias.map((subcategoria, index) => (
                                <option key={index} value={subcategoria}>
                                    {subcategoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="estoque" className="w-32 text-white">Estoque:</label>
                        <input
                            id="estoque"
                            type="number"
                            value={produtoSelecionado?.estoque || ""}
                            onChange={(e) =>
                                setProdutoSelecionado({
                                    ...produtoSelecionado,
                                    estoque: parseInt(e.target.value),
                                })
                            }
                            className="border p-2 rounded-md w-full"
                            placeholder="Estoque"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="preco" className="w-32 text-white">Preço:</label>
                        <input
                            id="preco"
                            type="number"
                            value={produtoSelecionado?.preco || ""}
                            onChange={(e) =>
                                setProdutoSelecionado({
                                    ...produtoSelecionado,
                                    preco: parseFloat(e.target.value),
                                })
                            }
                            className="border p-2 rounded-md w-full"
                            placeholder="Preço"
                        />
                    </div>
                </div>
            </Modal>
            <Footer />
        </>
    );
}
