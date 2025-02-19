import { useState, useEffect } from "react";

const CookieConsent = () => {
    const [mostrarBanner, setMostrarBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setMostrarBanner(true);
        }
    }, []);

    const aceitarCookies = () => {
        localStorage.setItem("cookieConsent", "true");
        setMostrarBanner(false);
        window.dispatchEvent(new Event("cookieConsentAccepted"));
    };

    const rejeitarCookies = () => {
        alert("Esse site necessita de cookies para funcionar!\nCaso não aceite os cookies, o site será recarregado para solicitar confirmação novamente.");
        localStorage.removeItem("token");
        setMostrarBanner(false);
        window.location.reload();
    };

    if (!mostrarBanner) return null;

    return mostrarBanner ? (
        <div className="fixed bottom-4 left-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm max-w-md">
                Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego.
                Ao continuar navegando, você concorda com nossa
                <a href="/politica-de-privacidade" className="underline text-teal-400 hover:text-teal-300 ml-1">
                    Política de Privacidade
                </a>.
            </p>
            <div className="flex gap-4 mt-2 md:mt-0">
                <button
                    onClick={aceitarCookies}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 transition rounded-lg text-white font-semibold"
                >
                    Aceitar
                </button>
                <button
                    onClick={rejeitarCookies}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 transition rounded-lg text-white font-semibold"
                >
                    Rejeitar
                </button>
            </div>
        </div>
    ) : null;
};

export default CookieConsent;
