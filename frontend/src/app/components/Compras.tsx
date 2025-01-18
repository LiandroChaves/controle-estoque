"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useRouter } from "next/navigation";
import logoCarrinho from '../../../public/assets/carrinho-de-compras.png';
import Footer from "./Footer";
import ObterProdutoModal from "./modalCarrinho";


export default function Compras() {
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
    };


    const fecharModal = () => {
        setProdutoSelecionado(null);
    };

    const handleAdicionarCarrinho = (produtoComQuantidade : any) => {
        console.log("Produto adicionado ao carrinho:", produtoComQuantidade);
        alert("Produto adicionado ao carrinho!");
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

    // ============================= Renderização ===============================
    return (
        <>
            <header className="bg-gray-100 shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <h1 className="text-3xl font-bold text-gray-800">EasyControl <p className="text-lg ml-12">Compras</p></h1>
                    {prodsCadastrados.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                            <h1 className="text-xl font-semibold">Produtos:</h1>
                            <p className="text-base">{item.quantProd}</p>
                        </div>
                    ))}
                    <div className="flex items-center gap-4">
                        {infor.length > 0 ? (
                            infor.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Image
                                        src={ftPerfil}
                                        alt="perfil"
                                        width={50}
                                        height={50}
                                        className="rounded-full border border-gray-300"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-base font-medium text-gray-700">Nome: {item.nome}</p>
                                        <p className="text-base font-medium text-gray-500">Empresa: {item.empresa}</p>
                                    </div>
                                    <p onClick={funcaoSair} className="relative flex left-20 text-red-600 cursor-pointer"><strong>Sair</strong></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhuma informação disponível.</p>
                        )}
                    </div>
                </div>
            </header>

            <nav className="bg-gray-800 h-12 flex items-center px-4">
                <div className="flex items-center gap-4">
                    <select
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        className="bg-gray-700 text-white rounded-md px-4 py-2"
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
                        className="bg-gray-700 text-white rounded-md px-4 py-2"
                    >
                        <option value="">Selecione uma subcategoria</option>
                        {subcategorias.map((subcategoria, index) => (
                            <option key={index} value={subcategoria}>
                                {subcategoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div
                    className="ml-8 bg-gray-700 text-white rounded-md px-4 py-2 hover:translate-y-[0.8px] hover:text-[17px] cursor-pointer"
                    onClick={alternarFavoritos}
                >
                    <button className="">
                        {mostrarFavoritos ? "Mostrar Todos" : "Favoritos"}
                    </button>
                </div>
                <button className="ml-8 bg-gray-700 text-white rounded-md px-4 py-2 hover:translate-y-[0.8px] hover:text-[17px] cursor-pointer" onClick={()=>{
                    router.push("/produtos")
                }}>Estoque</button>
                <button className="ml-3 bg-gray-700 text-white rounded-md px-4 py-2 hover:translate-y-[0.8px] hover:text-[17px] cursor-pointer" onClick={()=>{
                    router.push("/vendas")
                }}>Carrinho</button>
                <div className="ml-auto">
                    <div className="flex flex-row">
                        {produtosBuscados.length === 0 && (
                            <p className="text-white mr-5 mt-2">Nenhum produto encontrado</p>
                        )}
                        <input
                            type="text"
                            placeholder="Pesquisar por nome"
                            value={buscarTermo}
                            onChange={(e) => setBuscarTermo(e.target.value)}
                            className="bg-gray-700 text-white rounded-md px-4 py-2"
                        />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto mt-6 p-4">
                    {produtosBuscados.length === 0 && (
                            <p className="text-gray-500 mr-5 mt-2">Nenhum produto encontrado</p>
                        )}
                
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border border-gray-200 text-center">Produto</th>
                            <th className="p-3 border border-gray-200 text-center">Categoria</th>
                            <th className="p-3 border border-gray-200 text-center">Subcategoria</th>
                            <th className="p-3 border border-gray-200 text-center">Quant. Estoque</th>
                            <th className="p-3 border border-gray-200 text-center">Preço</th>
                            <th className="p-3 border border-gray-200 text-center">Obter no carrinho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosBuscados.map((produto, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition duration-200">
                                <td className="p-3 border border-gray-200 text-center">
                                    {produto.favorito && (
                                        <span className="text-yellow-500 mr-2" title="Favorito">★</span>
                                    )}
                                    {produto.nome}
                                </td>
                                <td className="p-3 border border-gray-200 text-center">{produto.categoria}</td>
                                <td className="p-3 border border-gray-200 text-center">{produto.subcategoria}</td>
                                <td className="p-3 border border-gray-200 text-center">{produto.estoque}</td>
                                <td className="p-3 border border-gray-200 text-center">{produto.preco} R$</td>
                                <td className="p-3 border border-gray-200 text-center">
                                    <button
                                        onClick={() => abrirModal(produto)}
                                        className=" text-white py-2"
                                    >
                                        <Image src={logoCarrinho} alt="editar" width={40} height={40}></Image>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {produtoSelecionado && (
                <ObterProdutoModal
                    produto={produtoSelecionado}
                    onClose={fecharModal}
                    onAdicionarCarrinho={handleAdicionarCarrinho}
                />
                )}
            </main>
            <Footer />
        </>
    );
}
