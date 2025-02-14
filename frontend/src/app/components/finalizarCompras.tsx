"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalFinalizarComprasProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    vendas: { preco?: number }[];
}

export default function ModalFinalizarCompras({ isOpen, setIsOpen, vendas = [] }: ModalFinalizarComprasProps) {
    const [desconto, setDesconto] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState("");

    // Verifica se "vendas" é um array antes de usar "reduce"
    const totalVendas = vendas.reduce((total, venda) => total + Number(venda.preco || 0), 0);
    const totalComDesconto = totalVendas * (1 - desconto / 100);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
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
                        onClick={() => {
                            toast.success("Compra finalizada com sucesso!");
                            setIsOpen(false);
                        }}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md"
                    >
                        Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
}