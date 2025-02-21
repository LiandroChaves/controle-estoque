"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgFundo from "../../../public/assets/comprar-online.png";

interface ModalFinalizarComprasUnicasProps {
    isOpenNow: boolean;
    setIsOpenNow: (isOpenNow: boolean) => void;
    venda: { id: any; preco?: number } | null;
    atualizarLista: () => void;
}


export default function ModalFinalizarComprasUnicas({ isOpenNow, setIsOpenNow, venda = null, atualizarLista }: ModalFinalizarComprasUnicasProps) {
    const [desconto, setDesconto] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState("");

    const totalVendas = venda?.preco ? Number(venda.preco) : 0;
    const totalComDesconto = totalVendas * (1 - desconto / 100);
    

    if (!isOpenNow) return null;

    if (!formaPagamento) {
        const btnFinalizar = document.getElementById("formaPagamento") as HTMLButtonElement;
        if (btnFinalizar) btnFinalizar.disabled = true;
    }


    const handleFinalizarCompra = async () => {
        if (!venda) return;
        if (!formaPagamento) {
            toast.error("Selecione uma forma de pagamento!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/finalizarvendaUnica", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendaId: venda.id,
                    desconto: desconto,
                    formaPagamento: formaPagamento,
                }),
            });

            if (!response.ok) throw new Error("Erro ao finalizar venda");
            toast.success("Compra finalizada com sucesso!");
            setIsOpenNow(false);
            atualizarLista(); // 🟢 Atualiza a lista sem recarregar a página
        } catch (error) {
            console.error(error);
            toast.error("Erro ao finalizar a compra");
        }
    };

    const removerItemCarrinho = async (vendaId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token || token === "undefined") {
                throw new Error("Usuário não autenticado. Faça login novamente.");
            }

            const response = await fetch(`http://localhost:5000/api/vendas/${vendaId}/limparUnico`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao remover item do carrinho");
            }

            toast.success("Item removido com sucesso!", {
                position: "bottom-right",
                autoClose: 3000,
            });

            atualizarLista();
            setIsOpenNow(false);
        } catch (error: any) {
            console.error("Erro ao remover item do carrinho:", error.message);
            alert(error.message);
        }
    };

    const handleClick = async () => {
        try {
            await handleFinalizarCompra();
            if (venda) {
                await removerItemCarrinho(venda.id);
            }
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
                    min={0}
                    max={100}
                    value={desconto > 0 ? desconto : ""}
                    onChange={(e) => {
                        let valor = Number(e.target.value);
                        if (valor > 100) valor = 100;
                        if (valor < 0 || e.target.value === "-") valor = 0;
                        setDesconto(valor);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "." || e.key === "+" || e.key === ",") {
                            e.preventDefault();
                        }
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
                        onClick={() => setIsOpenNow(false)}
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