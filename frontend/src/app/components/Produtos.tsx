"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ftPerfil from "../../../public/assets/ftPerfil.webp";
import { useRouter } from "next/navigation";

export default function Produtos() {

    interface Informacao {
        nome: string;
        empresa: string;
    }

    //  ===================================== States ====================================

    const [produtos, setProdutos] = useState<any[]>([]);
    const [buscarTermo, setBuscarTermo] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
    const [produtosBuscados, setProdutosBuscados] = useState(produtos);
    // const [infor, setInfor] = useState<Informacao[]>([]);
    const [infor, setInfor] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // ===================================================================================


    const categorias = [
        "Drinks de Verão",
        "Comidas",
    ];

    const subcategorias = [
        "Coquetéis",
        "Porções",
    ];

    // ================================ Contar os produtos cadastrados ====================================

    const prodsCadastrados = [
        {
            quantProd: `${produtos.length} produtos cadastrados`,
        },
    ];

    // ====================================================================================================

    // ============================== Verifica se os filtros estão limpos para voltar tudo ================

    const aplicarFiltros = () => {
        if (
            buscarTermo.trim() === "" &&
            categoriaSelecionada === "" &&
            subcategoriaSelecionada === ""
        ) {
            setProdutosBuscados(produtos);
            return;
        }

        // =====================================================================================================


        // ===================== Buscar por nome ou id =========================================================

        const termo = buscarTermo.toLowerCase();

        const filtrado = produtos.filter((produto) => {
            const correspondeCategoria =
                categoriaSelecionada === "" || produto.categoria === categoriaSelecionada;
            const correspondeSubcategoria =
                subcategoriaSelecionada === "" || produto.subcategoria === subcategoriaSelecionada;
            const correspondeBusca =
                termo === "" ||
                produto.nome.toLowerCase().includes(termo) ||
                produto.id.toString().includes(termo);

            return correspondeCategoria && correspondeSubcategoria && correspondeBusca;
        });

        setProdutosBuscados(filtrado);
    };

    // =======================================================================================

    // ========================== Carregar dados na tela =====================================
    const carregarProdutos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/produtos');

            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }

            const dados = await response.json();
            console.log(dados);

            setProdutos(dados);
            setProdutosBuscados(dados);

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // ============================================================================ 

    //  ================================ Caso != filtros carrega os dados =========
    useEffect(() => {
        carregarProdutos();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [buscarTermo, categoriaSelecionada, subcategoriaSelecionada]);

    // ============================================================================

    // =============================== Effect para informações do usuário =========

    const router = useRouter();

    useEffect(() => {
        const fetchInformacoes = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
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
                console.log("Dados do usuário autenticado:", data);

                setInfor([data]);
            } catch (err: any) {
                console.error("Erro ao buscar informações do usuário:", err.message);
                setError(err.message);
            }
        };

        fetchInformacoes();
    }, [router]);

    //  ===========================================================================================


    return (
        <>
            <header className="bg-gray-100 shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <h1 className="text-3xl font-bold text-gray-800">EasyControl</h1>

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
                        className="appearance-none bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="appearance-none bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecione uma subcategoria</option>
                        {subcategorias.map((subcategoria, index) => (
                            <option key={index} value={subcategoria}>
                                {subcategoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex ml-auto gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou ID"
                        value={buscarTermo}
                        onChange={(e) => setBuscarTermo(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </nav>

            <main className="container mx-auto mt-6 p-4">
                <table className="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border border-gray-200">Produto</th>
                            <th className="p-3 border border-gray-200">Categoria</th>
                            <th className="p-3 border border-gray-200">Subcategoria</th>
                            <th className="p-3 border border-gray-200">Estoque</th>
                            <th className="p-3 border border-gray-200">Preço</th>
                            <th className="p-3 border border-gray-200">Catálogo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosBuscados.map((produto, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition duration-200">
                                <td className="p-3 border border-gray-200 flex items-center gap-4">
                                    {produto.favorito && <span className="text-yellow-500">&#9733;</span>}
                                    <span>{produto.nome}</span>
                                </td>
                                <td className="p-3 border border-gray-200">{produto.categoria}</td>
                                <td className="p-3 border border-gray-200">{produto.subcategoria}</td>
                                <td className="p-3 border border-gray-200">{produto.estoque}</td>
                                <td className="p-3 border border-gray-200">{produto.preco}</td>
                                <td className="p-3 border border-gray-200">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked={produto.catalogo}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                                        <span className="peer-checked:translate-x-5 inline-block w-4 h-4 bg-white rounded-full transform transition-transform absolute left-1 top-0.5"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}