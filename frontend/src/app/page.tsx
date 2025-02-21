"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "./components/Login";
import Produtos from "./components/Produtos";
import PaginaVendas from "./components/Vendas";
import Compras from "./components/Compras";
import PoliticaDePrivacidade from "./components/PoliticaEPrivacidade";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (!token) {
            router.push("/login");
        }
    }, [router]);

    if (!isAuthenticated) {
        alert("Sua sessão expirou, por favor faça login novamente.");
        return <Login />;
    }

    return (
        <div>
            <h1 className="text-white text-center text-2xl">Bem-vindo ao Controle Financeiro</h1>
            <Produtos />
            <PaginaVendas />
            <Compras />
            <PoliticaDePrivacidade />
        </div>
    );
}
