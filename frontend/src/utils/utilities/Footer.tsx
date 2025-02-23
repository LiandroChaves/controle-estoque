"use client";

import Link from "next/link";
import Image from "next/image";
import instagram from "../../../public/assets/instagram.png";
import facebook from "../../../public/assets/facebook.png";
import whatsapp from "../../../public/assets/whatsapp.png";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-100 py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                {/* Seção de Links */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Link href="/" className="hover:text-gray-400 transition duration-200">
                        Início
                    </Link>
                    <Link href="/produtos" className="hover:text-gray-400 transition duration-200">
                        Produtos
                    </Link>
                    <Link href="/contato" className="hover:text-gray-400 transition duration-200">
                        Contato
                    </Link>
                </div>

                {/* Redes Sociais */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a
                        href="https://www.facebook.com/lica.chaves"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                    >
                        <Image
                            src={facebook}
                            alt="Facebook"
                            width={24}
                            height={24}
                            className="filter invert"
                        />
                    </a>
                    <a
                        href="https://www.instagram.com/l__chaveszzz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                    >
                        <Image
                            src={instagram}
                            alt="Instagram"
                            width={24}
                            height={24}
                            className="filter invert"
                        />
                    </a>
                    <a
                        href="https://wa.me/5588988216593?text=Olá%2C%20me%20chamo%20Liandro.%20Sou%20um%20desenvolvedor%20de%20sistemas%20junior%21%20Caso%20precise%20de%20algo%2C%20só%20me%20chamar%20no%20WhatsApp%20clicando%20no%20botão%20acima.%20%3A%29"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition duration-200"
                    >
                        <Image
                            src={whatsapp}
                            alt="WhatsApp"
                            width={24}
                            height={24}
                            className="filter invert"
                        />
                    </a>
                </div>

                {/* Copyright */}
                <div className="mt-4 md:mt-0 text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} EasyControl. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
