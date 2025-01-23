"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import logoDeletar from '../../../public/assets/excluir.png';
import Image from "next/image";
import Footer from './Footer';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Vendas() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    const [vendas, setVendas] = useState<any[]>([]);
    const [erro, setErro] = useState<string | null>(null);

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
            setUsuario(data); // Armazena os dados do usuário
        } catch (err: any) {
            console.error('Erro ao buscar informações do usuário:', err.message);
            setErro(err.message);
            router.push('/login'); // Redireciona para a página de login
        }
    };

    const fetchVendas = async (usuarioId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || token === 'undefined') {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            const response = await fetch(`http://localhost:5000/api/vendas/${usuarioId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Erro na API:', errorData);
                throw new Error(errorData || 'Erro ao buscar vendas');
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
        if (usuario) {
            fetchVendas(usuario.id); // Busca as vendas após obter o usuário
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

                toast.success('Venda excluída com sucesso!',{
                    position: 'bottom-right',
                    autoClose: 3000
                });
                setVendas((prevVendas) => prevVendas.filter((item) => item.id !== venda.id));
            } catch (error) {
                console.error('Erro ao deletar venda:', error);
                toast.error('Erro ao excluir a venda.',{
                    position: 'bottom-right',
                    autoClose: 3000
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-lg py-6">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-teal-400 flex items-center gap-4">
                        EasyControl
                        <span className="text-lg font-medium bg-teal-500 text-gray-900 px-3 py-1 rounded-full shadow-md">
                            Carrinho
                        </span>
                    </h1>
                    <button className="ml-4 text-red-500 font-bold cursor-pointer hover:underline">
                        Sair
                    </button>
                </div>
            </header>

            <nav className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shadow-md py-4">
                <div className="container mx-auto flex items-center justify-between gap-8 px-6">
                    <div className="flex items-center gap-4">
                        <select className="bg-gray-600 text-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-teal-500">
                            <option value="">Selecione uma categoria</option>
                            <option value="categoria1">Categoria 1</option>
                            <option value="categoria2">Categoria 2</option>
                        </select>

                        <select className="bg-gray-600 text-gray-300 rounded-lg px-4 py-2 shadow-md focus:ring-teal-500">
                            <option value="">Selecione uma subcategoria</option>
                            <option value="subcategoria1">Subcategoria 1</option>
                            <option value="subcategoria2">Subcategoria 2</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-6">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome"
                            className="bg-gray-700 text-white rounded-md px-4 py-2 shadow-md focus:ring-teal-500"
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

                                        toast.success('Carrinho esvaziado com sucesso!',{
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

            <main className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 min-h-screen px-6 py-12 text-gray-300">
                <div className="overflow-x-auto bg-gray-700 rounded-lg shadow-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-teal-400">
                                <th className="p-4 border-b border-gray-600 text-center">Produto</th>
                                <th className="p-4 border-b border-gray-600 text-center">Categoria</th>
                                <th className="p-4 border-b border-gray-600 text-center">Quantidade</th>
                                <th className="p-4 border-b border-gray-600 text-center">Preço</th>
                                <th className="p-4 border-b border-gray-600 text-center">Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas.map((venda) => (
                                <tr key={venda.id} className="hover:bg-gray-600 transition-all duration-200">
                                    <td className="p-4 border-b border-gray-600 text-center">{venda.produto}</td>
                                    <td className="p-4 border-b border-gray-600 text-center">{venda.categoria}</td>
                                    <td className="p-4 border-b border-gray-600 text-center">{venda.quantidade}</td>
                                    <td className="p-4 border-b border-gray-600 text-center">R$ {venda.preco}</td>
                                    <td className="p-4 border-b border-gray-600 text-center">
                                        <button
                                            onClick={() => deletarProduto(venda)}
                                            className="text-white py-2 rounded-md hover:text-red-500 transition-all"
                                        >
                                            <Image src={logoDeletar} alt="deletar" width={40} height={40} className='invert' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar aria-label={undefined} aria-live="polite" />
            <Footer />
        </div>
    );
}


