"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "./components/pages/Login";
import Produtos from "./components/pages/Produtos";
import PaginaVendas from "./components/pages/Vendas";
import Compras from "./components/pages/Compras";
import PoliticaDePrivacidade from "../utils/utilities/PoliticaEPrivacidade";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (!token) {
            router.push("/routes/login");
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
