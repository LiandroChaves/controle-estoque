"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import logoEditar from '../../../public/assets/caneta.png'
import logoDeletar from '../../../public/assets/excluir.png'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../utils/context/ThemeContext";


export default function FinalizarCompras() {

    interface Venda {
        id: number;
        produto: string;
        categoria: string;
        subcategoria: string;
        quantidade: number;
        preco: number;
        imagem?: string; // Campo opcional para a imagem do produto
    }


    // ================================ States ================================
    const [infor, setInfor] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imagemUsuario, setImagemUsuario] = useState<string | any>(ftPerfil);
    const [isVisible, setIsVisible] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const [vendas, setVendas] = useState<Venda[]>([]);

    useEffect(() => {
        const vendasSalvas = localStorage.getItem("vendasFinalizar");
        if (vendasSalvas) {
            try {
                const parsedVendas: Venda[] = JSON.parse(vendasSalvas);
                console.log("Dados carregados em FinalizarVendas:", parsedVendas);
                setVendas(parsedVendas);
            } catch (error) {
                console.error("Erro ao carregar vendas:", error);
            }
        }
    }, []);



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
            <header className={`${isDarkMode
                ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                : "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                } shadow-lg py-6 transition-all`}>
                <div className="container mx-auto flex justify-between items-center px-6">
                    <h1 className={`text-4xl font-bold ${isDarkMode ? "text-teal-400" : "text-white"
                        }`}>
                        EasyControl
                        <span
                            className={`ml-4 text-lg font-medium px-3 py-1 rounded-full shadow-md transition-all ${isDarkMode ? "bg-teal-500 text-gray-900" : "bg-gray-700 text-white"
                                }`}
                        >
                            Finalizar compra
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
            <main className={`min-h-screen px-6 py-12 transition-all ${isDarkMode
                ? "bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 text-gray-300"
                : "bg-gradient-to-b from-white via-white to-white text-white"
                }`}
            >
                <div className="grid grid-cols-auto-fill sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 justify-center">
                    {vendas.length > 0 ? (
                        vendas.map((venda) => (
                            <div
                                key={venda.id}
                                className="bg-gray-800 p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105 min-w-[250px] max-w-[300px] mx-auto"
                            >
                                {venda.imagem ? (
                                    <Image
                                        src={venda.imagem.startsWith("http") ? venda.imagem : `http://localhost:5000${venda.imagem}`}
                                        alt={venda.produto}
                                        width={200}
                                        height={200}
                                        className="rounded-lg mx-auto mb-4"
                                    />
                                ) : (
                                    <div className="w-48 h-48 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <span className="text-gray-400">Sem imagem</span>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-teal-400 text-center">{venda.produto}</h3>
                                <p className="text-gray-400 text-sm text-center">{venda.categoria}</p>
                                <p className="text-gray-400 text-sm text-center">{venda.subcategoria}</p>
                                <p className="text-gray-300 text-center mt-2">Quantidade: <span className="font-bold">{venda.quantidade}</span></p>
                                <p className="text-gray-300 text-center mt-1">Preço: <span className="font-bold">R$ {venda.preco}</span></p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">Nenhum produto para finalizar.</p>
                    )}
                </div>

                <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar aria-label={undefined} />
            </main>
            <Footer />

        </>
    );
}
