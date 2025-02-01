"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "./components/Login";
import Produtos from "./components/Produtos";
import PaginaVendas from "./components/Vendas";
import Compras from "./components/Compras";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (!token) {
            router.push("/login"); // Redireciona para a página de login se não estiver autenticado
        }
    }, [router]);

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div>
            <h1 className="text-white text-center text-2xl">Bem-vindo ao Controle Financeiro</h1>
            <Produtos />
            <PaginaVendas />
            <Compras />
        </div>
    );
}
