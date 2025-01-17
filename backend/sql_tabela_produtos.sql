select * from produtos;
SELECT * FROM informacoeslogin;
SELECT * FROM vendas;
select * from logsprodutos;

CREATE TABLE vendas (
  id SERIAL PRIMARY KEY,
  cod_produto INT NOT NULL,
  quantidade INT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT,
  CONSTRAINT fk_cod_produto FOREIGN KEY (cod_produto) REFERENCES produtos(id),
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES informacoesLogin(id)
);


INSERT INTO vendas (cod_produto, quantidade, preco, usuario_id)
VALUES
  (1, 10, 500.00, 1),  -- Venda do Produto A (10 unidades) para o Usuário 1
  (2, 5, 150.00, 2),   -- Venda do Produto B (5 unidades) para o Usuário 2
  (3, 3, 225.00, 1); 



CREATE TABLE informacoeslogin (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL
);

INSERT INTO informacoesLogin (login, senha, nome, empresa) VALUES
('joao.silva', 'Joao@1234', 'João Silva', 'TechNova Solutions'),


-- ================================= Produtos ====================================

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  categoria VARCHAR(255),
  subcategoria VARCHAR(255),
  estoque INT,
  preco DECIMAL(10, 2),
  catalogo VARCHAR(255),
  favorito BOOLEAN DEFAULT FALSE,
  usuario_id INT
);

INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Bomba de água', 'Peças', 'Carros', 28, 75, 'Catálogo Oficina', false, 1),


-- ======================= Logs produtos =========================================

CREATE TABLE IF NOT EXISTS logsprodutos (
    id SERIAL PRIMARY KEY,
    cod_produtos INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR(50) NOT NULL
);

--  ==============================================================================