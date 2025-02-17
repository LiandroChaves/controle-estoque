-- ======================= Tabela de Informações de Login =======================
CREATE TABLE IF NOT EXISTS informacoeslogin (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
	imagem VARCHAR(255)
);

-- ======================= Tabela de Produtos ===================================
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255),
    subcategoria VARCHAR(255),
    estoque INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    catalogo VARCHAR(255),
    favorito BOOLEAN DEFAULT FALSE,
    usuario_id INT,
	descricao TEXT,
	imagem VARCHAR(255),
);

update produtos set id = 19
where id = 19;

SELECT * FROM produtos;

-- ======================= Tabela de Vendas ====================================
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    cod_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    CONSTRAINT fk_cod_produto FOREIGN KEY (cod_produto) REFERENCES produtos(id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES informacoeslogin(id)
);

-- ======================= Tabela de Compras ===================================
CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    cod_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    usuario_id INT,
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cod_produto FOREIGN KEY (cod_produto) REFERENCES produtos(id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES informacoeslogin(id)
);

-- ======================= Tabela de finalizar vendas ==========================
CREATE TABLE IF NOT EXISTS finalizarvendas (
    id SERIAL PRIMARY KEY,
    venda_id INT,
    nome_produto VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(5,2), -- Porcentagem de desconto
    valor_final DECIMAL(10,2) NOT NULL, -- Preço final após desconto
    forma_pagamento VARCHAR(50) NOT NULL,
    data_finalizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venda_id) REFERENCES vendas(id)
);

-- ======================= Tabela de Logs dos Produtos =========================
CREATE TABLE IF NOT EXISTS logsprodutos (
    id SERIAL PRIMARY KEY,
    cod_produtos INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR(50) NOT NULL
);



-- ====================== Triggers =============================================

CREATE OR REPLACE FUNCTION preencher_preco_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Obter o preço do produto correspondente na tabela 'produtos'
    SELECT preco INTO NEW.preco
    FROM produtos
    WHERE id = NEW.cod_produto;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_preencher_preco_compra
BEFORE INSERT ON compras
FOR EACH ROW
EXECUTE FUNCTION preencher_preco_compra();


CREATE OR REPLACE FUNCTION inserir_em_vendas_e_atualizar_estoque()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular o valor total da venda e inserir na tabela 'vendas'
    INSERT INTO vendas (cod_produto, quantidade, preco, usuario_id)
    VALUES (
        NEW.cod_produto,
        NEW.quantidade,
        NEW.preco * NEW.quantidade, -- Cálculo do preço total
        NEW.usuario_id
    );

    -- Atualizar o estoque do produto na tabela 'produtos'
    UPDATE produtos
    SET estoque = estoque - NEW.quantidade
    WHERE id = NEW.cod_produto;

    -- Verificar se o estoque ficou negativo
    IF (SELECT estoque FROM produtos WHERE id = NEW.cod_produto) < 0 THEN
        RAISE EXCEPTION 'Estoque insuficiente para o produto ID %', NEW.cod_produto;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_inserir_vendas_e_atualizar_estoque
AFTER INSERT ON compras
FOR EACH ROW
EXECUTE FUNCTION inserir_em_vendas_e_atualizar_estoque();

CREATE OR REPLACE FUNCTION restaurar_estoque_ao_deletar_venda()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar o estoque do produto na tabela 'produtos'
    UPDATE produtos
    SET estoque = estoque + OLD.quantidade
    WHERE id = OLD.cod_produto;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_restaurar_estoque
AFTER DELETE ON vendas
FOR EACH ROW
EXECUTE FUNCTION restaurar_estoque_ao_deletar_venda();


-- ================= Inserts ===================================================

INSERT INTO informacoeslogin (login, senha, nome, empresa) 
VALUES 
('joao.silva', 'Joao@1234', 'João Silva', 'TechNova Solutions');

INSERT INTO vendas (cod_produto, quantidade, preco, usuario_id)
VALUES 
(1, 10, 750.00, 1), -- Venda com preço total já calculado
(2, 4, 200.00, 2);  -- Venda com preço total já calculado

INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Bomba de água', 'Peças', 'Carros', 28, 75.00, 'Catálogo Oficina', FALSE, 1),
('Filtro de óleo', 'Peças', 'Carros', 15, 50.00, 'Catálogo Oficina', FALSE, 1),
('Velas de ignição', 'Peças', 'Carros', 10, 30.00, 'Catálogo Oficina', FALSE, 1);

INSERT INTO compras (cod_produto, quantidade, usuario_id)
VALUES 
(1, 5, 1), -- Compra para o produto 'Bomba de água'
(2, 3, 1); -- Compra para o produto 'Filtro de óleo'

-- ========================== Selects =========================================
 
SELECT * FROM produtos;
SELECT * FROM informacoeslogin;
SELECT * FROM vendas;
SELECT * FROM compras;
SELECT * FROM logsprodutos;
select * from finalizarvendas;