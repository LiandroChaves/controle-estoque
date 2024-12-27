import React from 'react';

const PaginaVendas: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">EasyControl - Vendas</h1>
          <button className="text-red-500 font-semibold">Sair</button>
        </div>
      </header>

      {/* Filtros e Ações */}
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

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Adicionar venda
          </button>
        </div>

        {/* Tabela de Vendas */}
        <div className="overflow-x-auto bg-white rounded shadow-md">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Quantidade</th>
                <th className="py-3 px-4">Preço</th>
                <th className="py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">Produto 1</td>
                <td className="py-3 px-4">Categoria 1</td>
                <td className="py-3 px-4">10</td>
                <td className="py-3 px-4">R$ 19,90</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600">Editar</button>
                  <button className="text-red-500 hover:text-red-600">Deletar</button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">Produto 2</td>
                <td className="py-3 px-4">Categoria 2</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">R$ 29,90</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600">Editar</button>
                  <button className="text-red-500 hover:text-red-600">Deletar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          &copy; 2024 EasyControl. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PaginaVendas;
