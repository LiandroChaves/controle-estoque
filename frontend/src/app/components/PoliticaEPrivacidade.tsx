import React from "react";

export default function PoliticaDePrivacidade() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-teal-400 mb-6">Política de Privacidade e Termos de Uso</h1>
                
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-teal-300 mb-2">1. Coleta de Informações</h2>
                    <p>
                        O EasyControl coleta informações como nome, e-mail e dados financeiros para fornecer nossos serviços.
                        Garantimos que seus dados serão tratados com segurança e não serão compartilhados sem sua autorização.
                    </p>
                </section>
                
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-teal-300 mb-2">2. Uso de Cookies</h2>
                    <p>
                        Utilizamos cookies para melhorar a experiência do usuário. Você pode aceitar ou rejeitar o uso de cookies
                        nas configurações do seu navegador.
                    </p>
                </section>
                
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-teal-300 mb-2">3. Segurança dos Dados</h2>
                    <p>
                        Implementamos medidas de segurança para proteger suas informações contra acessos não autorizados.
                    </p>
                </section>
                
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-teal-300 mb-2">4. Direitos do Usuário</h2>
                    <p>
                        Você pode solicitar a exclusão de seus dados ou alteração de informações pessoais a qualquer momento
                        entrando em contato conosco.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-xl font-semibold text-teal-300 mb-2">5. Contato</h2>
                    <p>
                        Para dúvidas ou solicitações sobre sua privacidade, entre em contato pelo e-mail:
                        <span className="text-teal-400"> suporte@easycontrol.com</span>
                    </p>
                </section>
                
                <div className="mt-8 flex justify-center">
                    <a
                        href="/"
                        className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition"
                    >
                        Voltar ao Início
                    </a>
                </div>
            </div>
        </div>
    );
}