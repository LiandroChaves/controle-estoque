"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgFundo from "../../../public/assets/comprar-online.png";

interface ModalFinalizarComprasProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    vendas: {
        id: any; preco?: number
    }[];
}

export default function ModalFinalizarCompras({ isOpen, setIsOpen, vendas = [] }: ModalFinalizarComprasProps) {
    const [desconto, setDesconto] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState("");

    // Verifica se "vendas" é um array antes de usar "reduce"
    const totalVendas = vendas.reduce((total, venda) => total + Number(venda.preco || 0), 0);
    const totalComDesconto = totalVendas * (1 - desconto / 100);

    if (!isOpen) return null;
    
    if (!formaPagamento) {
        const btnFinalizar = document.getElementById("formaPagamento") as HTMLButtonElement;
        if (btnFinalizar) btnFinalizar.disabled = true;
    }
    

    const handleFinalizarCompra = async () => {
        if (!formaPagamento) {
            toast.error("Selecione uma forma de pagamento!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/finalizarvenda", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendas: vendas.map(venda => ({
                        vendaId: venda.id, // ID da venda
                        desconto: desconto, // Desconto aplicado
                        formaPagamento: formaPagamento, // Forma de pagamento
                    })),
                }),
            });

            if (!response.ok) throw new Error("Erro ao finalizar vendas");
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao finalizar as compras");
        }
    };

    const esvaziarCarrinho = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || token === 'undefined') {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
            if (!userId) {
                throw new Error('Usuário não autenticado. Faça login novamente.');
            }

            const response = await fetch(`http://localhost:5000/api/vendas/usuario/${userId}/limpar`, {
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

    const handleClick = async () => {
        try {
            await handleFinalizarCompra();
            await esvaziarCarrinho();
            toast.success("Compra finalizada com sucesso!"); // Exibe o toast de sucesso
            setIsOpen(false); // Fecha o modal
        } catch (error) {
            console.error(error);
            toast.error("Erro ao finalizar a compra");
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${imgFundo.src})`,
                    backgroundSize: "500px",
                    backgroundPosition: "top",
                }}>
                <h2 className="text-xl text-white font-bold text-center mb-4">Finalizar Compra</h2>

                <p className="text-white text-center mb-2">
                    Total: R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

                <label className="block text-white mb-2">Desconto (Opcional):</label>
                <input
                    type="number"
                    value={desconto > 0 ? desconto : ""} // Se for 0, exibe string vazia
                    onChange={(e) => {
                        const valor = Number(e.target.value);
                        setDesconto(valor >= 0 ? valor : 0); // Impede valores negativos
                    }}
                    className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
                />


                <p className="text-white text-center mb-2">
                    Total com desconto: R$ {totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

                <label className="block text-white mb-2">Forma de Pagamento:</label>
                <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
                >
                    <option value="">Selecione</option>
                    <option value="pix">Pix</option>
                    <option value="cartao">Cartão</option>
                    <option value="dinheiro">Dinheiro</option>
                </select>

                <div className="flex justify-between">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleClick}
                        className="px-4 py-2 rounded-md text-white 
        disabled:bg-gray-500 disabled:cursor-not-allowed 
        bg-teal-600 hover:bg-teal-500 transition"
                        disabled={!formaPagamento} // O botão desativa automaticamente baseado no estado
                    >
                        Finalizar
                    </button>

                </div>
            </div>
        </div>
    );
}