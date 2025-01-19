"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import logoDeletar from '../../../public/assets/excluir.png';
import Image from "next/image";


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

                alert('Venda excluída com sucesso!');
                setVendas((prevVendas) => prevVendas.filter((item) => item.id !== venda.id));
            } catch (error) {
                console.error('Erro ao deletar venda:', error);
                alert('Erro ao excluir a venda.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">EasyControl<p className="text-lg ml-12">Carrinho</p></h1>
                    <button className="text-red-500 font-semibold">Sair</button>
                </div>
            </header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex space-x-4">
                        <select className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700">
                            <option value="">Selecione uma categoria</option>
                            <option value="categoria1">Categoria 1</option>
                            <option value="categoria2">Categoria 2</option>
                        </select>

                        <select className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700">
                            <option value="">Selecione uma subcategoria</option>
                            <option value="subcategoria1">Subcategoria 1</option>
                            <option value="subcategoria2">Subcategoria 2</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome"
                        className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700"
                    />
                    <button
                        onClick={async () => {
                            if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
                                try {
                                    const token = localStorage.getItem('token');
                                    if (!token || token === 'undefined') {
                                        throw new Error('Usuário não autenticado. Faça login novamente.');
                                    }

                                    // Faz a chamada para o backend para excluir todas as vendas e restaurar o estoque
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

                                    alert('Carrinho esvaziado com sucesso!');
                                    window.location.reload(); // Atualiza a página para refletir o carrinho vazio
                                } catch (error:any) {
                                    console.error('Erro ao esvaziar o carrinho:', error.message);
                                    alert(error.message);
                                }
                            }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Esvaziar o carrinho
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded shadow-md">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm text-center">
                                <th className="py-3 px-4 text-center">Produto</th>
                                <th className="py-3 px-4 text-center">Categoria</th>
                                <th className="py-3 px-4 text-center">Quantidade</th>
                                <th className="py-3 px-4 text-center">Preço</th>
                                <th className="py-3 px-4 text-center">Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas.map((venda) => (
                                <tr key={venda.id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4 text-center">{venda.produto}</td>
                                    <td className="py-3 px-4 text-center">{venda.categoria}</td>
                                    <td className="py-3 px-4 text-center">{venda.quantidade}</td>
                                    <td className="py-3 px-4 text-center">R$ {venda.preco}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => deletarProduto(venda)}
                                            className=" text-white py-2"
                                        >
                                            <Image src={logoDeletar} alt="deletar" width={40} height={40}></Image>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    &copy; 2024 EasyControl. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}


