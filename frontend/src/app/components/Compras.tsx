"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useRouter } from "next/navigation";
import logoCarrinho from '../../../public/assets/carrinho-de-compras.png';
import Footer from "./Footer";
import ObterProdutoModal from "./modalCarrinho";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

    const [showModal, setShowModal] = useState(false);
    const [senha, setSenha] = useState("");

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

    const handleConfirmSenha = async () => {
        try {
            const token = localStorage.getItem("token"); // Obtém o token armazenado no localStorage
            
            if (!token) {
                throw new Error("Token de autenticação não encontrado.");
            }

            const response = await fetch("http://localhost:5000/api/compras/verificarsenha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                },
                body: JSON.stringify({ senha }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (data.block) {
                    alert("Muitas tentativas mal sucedidas!\nPor questão de segurança, você será redirecionado para a página de login novamente.");
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                // Exibe a quantidade de tentativas restantes
                if (data.attemptsLeft !== undefined) {
                    setError(`Senha incorreta. Você tem ${data.attemptsLeft} tentativas restantes.`);
                } else {
                    setError(data.error || "Erro ao validar a senha.");
                }
                return;
            }

            setError("");
            setShowModal(false);
            window.location.href = "/produtos";
        } catch (error: any) {
            console.error("Erro ao validar a senha:", error.message);
            setError("Erro ao conectar ao servidor.");
        }
    };
    
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

    const handleAdicionarCarrinho = (produtoComQuantidade: any) => {
        toast.success("Compra realizada com sucesso!", {
            position: "bottom-right",
            autoClose: 3000,
        });
        console.log("Produto adicionado ao carrinho:", produtoComQuantidade);
        toast.success("Produto adicionado ao carrinho!",{
            position: "bottom-right",
            autoClose: 3000,
        });
        setTimeout(() => {
            window.location.reload();
        }, 2000);        
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

    const favoritarProduto = async (produto: any) => {
        try {
            const response = await fetch(`http://localhost:5000/api/produtos/${produto.id}/favorito`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favorito: !produto.favorito }),
            });

            if (!response.ok) {
                throw new Error("Erro ao favoritar produto.");
            }

            toast.success(`${produto.nome} foi ${produto.favorito ? "removido dos favoritos" : "adicionado aos favoritos"} com sucesso!`,{
                    position: "bottom-right",
                    autoClose: 3000,
                })
            setTimeout(()=>{
                window.location.reload();
            },2000)
        } catch (error) {
            console.error("Erro ao favoritar produto:", error);
            toast.error("Erro ao favoritar produto.",{
                position: "bottom-right",
                autoClose: 3000,
            });
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
                            Compras
                        </span>
                    </h1>
                    <div className="flex items-center gap-8">
                        {prodsCadastrados.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-teal-400 bg-gray-700 px-4 py-2 rounded-lg shadow-md">
                                <h1 className="text-lg font-semibold">Produtos:</h1>
                                <p className="text-xl font-bold">{item.quantProd}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
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
                                        <strong>Sair</strong>
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
                <div className="container mx-auto flex items-center justify-between gap-8 px-6">
                    <div className="flex items-center gap-4">
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
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={alternarFavoritos}
                            className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                        >
                            {mostrarFavoritos ? "Mostrar Todos" : "Favoritos"}
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                        >
                            Estoque
                        </button>
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate__animated animate__zoomIn">
                                    <h2 className="text-xl text-white font-bold mb-4">Confirme sua senha</h2>
                                    <input
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-2 animate-pulse">
                                            {error}
                                        </p>
                                    )}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 hover:underline mr-4"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConfirmSenha}
                                            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => router.push("/vendas")}
                            className="bg-gray-600 text-teal-400 px-6 py-2 rounded-lg shadow-md font-bold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all"
                        >
                            Carrinho
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
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
                </div>
            </nav>
            <main className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 min-h-screen px-6 py-12 text-gray-300">
                {produtosBuscados.length === 0 && (
                    <p className="text-gray-500 mr-5 mt-2">Nenhum produto encontrado</p>
                )}
                <table className="w-full text-left border-collapse shadow-lg bg-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-800 text-teal-400">
                            <th className="p-4 border-b border-gray-600 text-center">Produto</th>
                            <th className="p-4 border-b border-gray-600 text-center">Categoria</th>
                            <th className="p-4 border-b border-gray-600 text-center">Subcategoria</th>
                            <th className="p-4 border-b border-gray-600 text-center">Quant. Estoque</th>
                            <th className="p-4 border-b border-gray-600 text-center">Preço</th>
                            <th className="p-4 border-b border-gray-600 text-center">Obter no Carrinho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosBuscados.map((produto, index) => (
                            <tr key={index}
                                className="group hover:bg-gray-600 transition-all duration-200 relative">
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
                                    <button
                                        onClick={() => abrirModal(produto)}
                                        className=" text-white py-2 rounded-md invert"
                                    >
                                        <Image src={logoCarrinho} alt="Logo-Carrinho" width={40} height={40}></Image>
                                    </button>
                                </td>
                                <td
                                    className="absolute left-[190px] top-[55px] transform -translate-x-1/2 opacity-0 group-hover:opacity-100 -bottom-8 group-hover:bottom-2 transition-all duration-300"
                                >
                                    <button
                                        className="bg-gray-700 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg"
                                        onClick={() => favoritarProduto(produto)}
                                    >
                                        {produto.favorito ? "💔 Desfavoritar produto" : "❤️ Favoritar Produto"}
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
                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar aria-label={undefined} />
            </main>
            <Footer />

        </>
    );
}
