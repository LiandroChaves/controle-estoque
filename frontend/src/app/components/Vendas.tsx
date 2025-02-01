"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import logoDeletar from '../../../public/assets/excluir.png';
import Image from "next/image";
import Footer from './Footer';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoEditar from '../../../public/assets/caneta.png'
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useTheme } from "../../utils/context/ThemeContext";


export default function Vendas() {
    const router = useRouter();

    const [buscarTermo, setBuscarTermo] = useState("");
    const [vendas, setVendas] = useState<Venda[]>([]); // Estado para todas as vendas
    const [vendasBuscados, setVendasBuscados] = useState<Venda[]>([]);
    const [erro, setErro] = useState<string | null>(null);
    const [infor, setInfor] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isDarkMode, toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [imagemUsuario, setImagemUsuario] = useState<string | any>(ftPerfil); // Estado para armazenar a imagem do usuário
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [categorias, setCategorias] = useState<string[]>([]);

    const [usuario, setUsuario] = useState<any>(null);


    interface Venda {
        id: number;
        produto: string;
        categoria: string;
        quantidade: number;
        preco: number;
    }

    const deletarImg = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                // Remove a imagem do localStorage
                localStorage.removeItem(`imagemUsuario_${userId}`);

                // Define uma imagem padrão (se necessário)
                setImagemUsuario('http://localhost:5000/uploads/default-image.webp');

                const token = localStorage.getItem('token');
                if (!token) throw new Error('Usuário não autenticado.');

                const response = await fetch(`http://localhost:5000/api/upload/delete-image/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro ao deletar imagem: ${errorText}`);
                }

                toast.success('Imagem deletada com sucesso.', {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                throw new Error('Usuário não identificado.');
            }
        } catch (error: any) {
            console.error('Erro ao deletar imagem:', error.message);
            toast.error('Erro ao deletar imagem.', {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    const funcaoSair = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const imagePath = await uploadImagem(file);
                const imageUrl = `http://localhost:5000${imagePath}`;
                setImagemUsuario(imageUrl);

                // Salva a URL no localStorage com a chave sendo o userId
                const userId = localStorage.getItem('userId');
                if (userId) {
                    localStorage.setItem(`imagemUsuario_${userId}`, imageUrl);
                }
            } catch (error) {
                alert('Erro ao fazer upload da imagem.');
            }
        }
    };

    const fetchCategoriasVendas = async () => {
        try {
            const usuario = await fetchUsuario(); // Função que retorna os dados do usuário
            const userId = usuario?.id;

            if (!userId) {
                throw new Error('ID do usuário não encontrado.');
            }

            const response = await fetch(`http://localhost:5000/api/categorias/vendas?userId=${userId}`);

            if (!response.ok) {
                throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
            }

            const dados = await response.json();
            const categorias = dados.map((item: { categoria: string }) => item.categoria);

            setCategorias(categorias);
        } catch (error) {
            console.error('Erro ao buscar categorias de vendas:', error);
        }
    };

    useEffect(() => {
        fetchCategoriasVendas(); // Chama a função ao montar o componente
    }, []);

    const aplicarFiltros = () => {
        if (buscarTermo.trim() === "") {
            // Se o termo de busca estiver vazio, exibe todas as vendas
            setVendasBuscados(vendas);
            return;
        }

        const termo = buscarTermo.toLowerCase();

        // Filtra as vendas com base no termo de busca
        const filtrado = vendas.filter((venda) => {
            const correspondeBusca = venda.produto.toLowerCase().includes(termo);
            return correspondeBusca;
        });

        // Atualiza o estado com as vendas filtradas
        setVendasBuscados(filtrado);
    };

    // Aplica os filtros sempre que o termo de busca mudar
    useEffect(() => {
        aplicarFiltros();
    }, [buscarTermo, vendas]);

    const uploadImagem = async (file: File): Promise<string> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autenticado.');

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('http://localhost:5000/api/upload', {
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

    const fetchVendasPorCategoria = async (categoria: string) => {
        try {
            if (!categoria) {
                setVendas([]); // Se nenhuma categoria for selecionada, limpa os dados
                return;
            }

            const token = localStorage.getItem('token'); // Obtém o token do localStorage

            if (!token || token === "undefined") {
                throw new Error("Usuário não autenticado. Faça login novamente.");
            }

            const response = await fetch(`http://localhost:5000/api/vendas/categoria/${encodeURIComponent(categoria)}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.statusText}`);
            }

            const dados = await response.json();
            console.log("📌 Vendas filtradas:", dados); // Debug

            setVendas(dados); // Atualiza o estado com os dados filtrados
        } catch (error) {
            console.error("❌ Erro ao buscar vendas por categoria:", error);
        }
    };


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
            setUsuario(data); // Armazena o usuário no estado
            return data;
        } catch (err: any) {
            console.error('Erro ao buscar informações do usuário:', err.message);
            router.push('/login');
            throw err;
        }
    };

    const fetchVendas = async (usuarioId: number) => {
        try {
            usuarioId = localStorage.getItem('userId') as unknown as number;
            const token = localStorage.getItem('token');

            if (!token || token === 'undefined') {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }
            console.log('ID do usuário:', usuarioId);
            const response = await fetch(`http://localhost:5000/api/vendas/${usuarioId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json(); // Alterado para response.json()
                console.error('Erro na API:', errorData);
                throw new Error(errorData.error || 'Erro ao buscar vendas');
            }

            const data = await response.json();
            console.log('Dados das vendas:', data); // Log para depuração
            setVendas(data);  // Armazena os dados das vendas
        } catch (err: any) {
            console.error('Erro ao buscar vendas:', err.message);
            setErro(err.message);
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            await fetchUsuario();
        };
        carregarDados();
    }, []);

    useEffect(() => {
        if (usuario && usuario.id) {
            fetchVendas(usuario.id);
        }
    }, [usuario]);


    if (erro) {
        return <div>Erro: {erro}</div>;
    }

    const deletarProduto = async (venda: any) => {
        if (confirm(`Tem certeza que deseja excluir a venda do produto "${venda.produto} com o valor de ${venda.preco}"?`)) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Usuário não autenticado.');
                }

                const response = await fetch(`http://localhost:5000/api/vendas/${venda.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Erro ao deletar venda!');
                }

                toast.success('Venda excluída com sucesso!', {
                    position: 'bottom-right',
                    autoClose: 3000
                });
                setVendas((prevVendas) => prevVendas.filter((item) => item.id !== venda.id));
            } catch (error) {
                console.error('Erro ao deletar venda:', error);
                toast.error('Erro ao excluir a venda.', {
                    position: 'bottom-right',
                    autoClose: 3000
                });
            }
        }
    };

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUsuario();
                const userId = userData.id; // Assumindo que o ID do usuário vem da resposta do fetch

                // Salvar o userId no localStorage
                localStorage.setItem('userId', userId);

                // Recupera a imagem do usuário baseado no userId
                const imagemSalva = localStorage.getItem(`imagemUsuario_${userId}`);
                if (imagemSalva) {
                    setImagemUsuario(imagemSalva); // Carrega a imagem do usuário
                } else {
                    // Se não encontrar, você pode definir uma imagem padrão ou carregar uma imagem do servidor
                    setImagemUsuario('http://localhost:5000/uploads/default-image.webp');
                }
            } catch (err: any) {
                console.error('Erro ao buscar dados do usuário:', err.message);
                // Redireciona para login ou outro comportamento desejado
            }
        };

        fetchUserData();
    }, []); // Quando o componente é montado, chama o fetchUserData


    const totalVendas = vendas.reduce((total, venda) => total + Number(venda.preco), 0);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className={`${isDarkMode
                ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                : "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                } shadow-lg py-6 transition-all`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <h1 className={`text-4xl font-bold ${isDarkMode ? "text-teal-400" : "text-white"
                        }`}>
                        EasyControl
                        <span className={`ml-4 text-lg font-medium px-3 py-1 rounded-full shadow-md transition-all ${isDarkMode ? "bg-teal-500 text-gray-900" : "bg-gray-700 text-white"
                            }`}>
                            Carrinho
                        </span>
                    </h1>
                    <div className="flex items-center gap-4">
                        {infor.length > 0 ? (
                            infor.map((item, index) => (
                                <div key={index} className={`flex items-center gap-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-700"
                                    } rounded-lg shadow-md px-4 py-2 transition-all`}>
                                    <Image
                                        src={imagemUsuario}
                                        alt="Imagem do perfil"
                                        width={100}
                                        height={100}
                                        className={`w-16 h-16 rounded-full border-2 transition-all ${isDarkMode ? "border-teal-500" : "border-white"
                                            }`}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setIsVisible(!isVisible)}
                                            className={`text-sm mt-1 p-2 rounded-lg cursor-pointer transition-all ${isVisible
                                                ? "bg-red-500 hover:bg-red-600 w-9 relative text-white"
                                                : isDarkMode
                                                    ? "bg-teal-500 hover:bg-teal-600 text-white"
                                                    : "bg-gray-400 hover:bg-gray-500 text-white"
                                                }`}
                                        >
                                            {isVisible ? "X" : "☰"}
                                        </button>
                                        <label
                                            htmlFor="file-input"
                                            className={`${isVisible ? "flex" : "hidden"} text-sm mt-1 p-2 bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-600`}
                                        >
                                            <Image src={logoEditar} alt="alterarimg" width={22} height={22} className="invert ">
                                            </Image>
                                        </label>
                                        <button
                                            onClick={deletarImg}
                                            className={`${isVisible ? "flex" : "hidden"} text-sm mt-1 p-2 bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-600 self-center`}
                                        >
                                            <Image src={logoDeletar} alt="deleatrimg" width={22} height={22} className="invert ">
                                            </Image>
                                        </button>
                                    </div>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            className={`font-bold transition-all ${isDarkMode ? "text-teal-400" : "text-white"
                                                }`}
                                        >
                                            Nome: {item.nome}
                                        </p>
                                        <p
                                            className={`font-medium transition-all ${isDarkMode ? "text-gray-400" : "text-white"
                                                }`}
                                        >
                                            Empresa: {item.empresa}
                                        </p>
                                    </div>
                                    <p
                                        onClick={funcaoSair}
                                        className={`font-bold cursor-pointer underline ${isDarkMode ? "text-red-500" : "text-red-500"
                                            }`}
                                    >
                                        <strong>Sair</strong>
                                    </p>
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-lg font-bold transition-all ${isDarkMode

                                            ? "bg-gray-500 text-teal-600 hover:bg-teal-500 hover:text-white"
                                            : "bg-gray-500 text-teal-400 hover:bg-teal-500 hover:text-white"
                                            }`}
                                    >
                                        {isDarkMode ? "☀️" : "🌙"}
                                    </button>
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
                            onChange={async (e) => {
                                const categoria = e.target.value;
                                setCategoriaSelecionada(categoria);

                                if (categoria === "") {
                                    // Se a categoria selecionada for "Selecione uma categoria"
                                    const usuario = await fetchUsuario();
                                    fetchVendas(usuario);
                                } else {
                                    // Caso contrário, busca as vendas por categoria
                                    fetchVendasPorCategoria(categoria);
                                }
                            }}
                            className="bg-gray-600 text-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-teal-500"
                        >
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((categoria, index) => (
                                <option key={index} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push("/compras")}
                            className={`px-6 py-2 rounded-lg shadow-md font-bold transform hover:scale-105 transition-all ${isDarkMode
                                ? "bg-gray-600 text-teal-400 hover:bg-teal-600 hover:text-white"
                                : "bg-gray-600 text-white hover:bg-teal-500 hover:text-white"
                                }`}
                        >
                            Compras
                        </button>
                        {vendas.length === 0 && (
                            <p
                                className={`mr-5 mt-2 transition-all ${isDarkMode ? "text-white" : "text-white"
                                    }`}
                            >
                                Nenhuma venda encontrada
                            </p>

                        )}
                        <input
                            type="text"
                            placeholder="Pesquisar por nome"
                            value={buscarTermo}
                            onChange={(e) => setBuscarTermo(e.target.value)}
                            className={`rounded-md px-4 py-2 transition-all ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                                }`}
                        />
                        <button
                            onClick={async () => {
                                if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
                                    try {
                                        const token = localStorage.getItem('token');
                                        if (!token || token === 'undefined') {
                                            throw new Error('Usuário não autenticado. Faça login novamente.');
                                        }

                                        const response = await fetch(`http://localhost:5000/api/vendas/usuario/${usuario.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        });

                                        if (!response.ok) {
                                            const errorData = await response.json();
                                            throw new Error(errorData.error || 'Erro ao esvaziar o carrinho');
                                        }

                                        toast.success('Carrinho esvaziado com sucesso!', {
                                            position: 'bottom-right',
                                            autoClose: 3000
                                        });
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    } catch (error: any) {
                                        console.error('Erro ao esvaziar o carrinho:', error.message);
                                        alert(error.message);
                                    }
                                }
                            }}
                            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-bold hover:bg-red-600 transform hover:scale-105 transition-all"
                        >
                            Esvaziar o carrinho
                        </button>
                    </div>
                </div>
            </nav>

            <main className={`min-h-screen px-6 py-12 transition-all ${isDarkMode
                ? "bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 text-gray-300"
                : "bg-gradient-to-b from-white via-white to-white text-white"
                }`}>
                <div className="overflow-x-auto bg-gray-700 rounded-lg shadow-md">
                    <table className={`w-full text-left border-collapse shadow-lg rounded-lg transition-all ${isDarkMode ? "bg-gray-700" : "bg-gray-600"
                        }`}>
                        <thead>
                            <tr className={`transition-all ${isDarkMode ? "bg-gray-800 text-teal-400" : "bg-gray-700 text-white"
                                }`}>
                                <th className="p-4 border-b border-gray-600 text-center">Produto</th>
                                <th className="p-4 border-b border-gray-600 text-center">Categoria</th>
                                <th className="p-4 border-b border-gray-600 text-center">Quantidade</th>
                                <th className="p-4 border-b border-gray-600 text-center">Preço</th>
                                <th className="p-4 border-b border-gray-600 text-center">Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendasBuscados.length > 0 ? (
                                // Se houver vendas buscadas, renderiza essas vendas
                                vendasBuscados.map((venda) => (
                                    <tr key={venda.id} className="hover:bg-gray-500 transition-all duration-200">
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.produto}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.categoria}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.quantidade}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">R$ {venda.preco}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">
                                            <button
                                                onClick={() => deletarProduto(venda)}
                                                className="text-white py-2 rounded-md hover:text-red-500 transition-all"
                                            >
                                                <Image src={logoDeletar} alt="deletar" width={40} height={40} className="invert" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                vendasBuscados.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className={`text-center p-4 ${isDarkMode ? "text-white" : "text-white"
                                            }`}>
                                            Nenhuma venda encontrada
                                        </td>
                                    </tr>
                                )
                            )}
                            {vendas.length > 0 && vendasBuscados.length === 0 && (
                                // Caso não haja vendas buscadas, renderiza todas as vendas
                                vendas.map((venda) => (
                                    <tr key={venda.id} className="hover:bg-gray-500 transition-all duration-200">
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.produto}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.categoria}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">{venda.quantidade}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">R$ {venda.preco}</td>
                                        <td className="p-4 border-b border-gray-600 text-center">
                                            <button
                                                onClick={() => deletarProduto(venda)}
                                                className="text-white py-2 rounded-md hover:text-red-500 transition-all"
                                            >
                                                <Image src={logoDeletar} alt="deletar" width={40} height={40} className="invert" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            <tr>
                                <td colSpan={5} className="p-4 border-t border-gray-600 text-white text-center font-bold rounded-lg">
                                    <span className={`px-4 py-2 rounded-md shadow-md transition-all ${isDarkMode ? "bg-teal-600" : "bg-gray-700 text-white"
                                        }`}>
                                        Total: R$ {totalVendas.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </main>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar aria-label={undefined} aria-live="polite" />
            <Footer />
        </div>
    );
}
