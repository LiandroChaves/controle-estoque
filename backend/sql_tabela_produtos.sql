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

-- Ver o nome sequencia de id 
SELECT column_default
FROM information_schema.columns
WHERE table_name = 'produtos' AND column_name = 'id';

-- Alterar a sequencia de id sem dropar tabela
ALTER SEQUENCE produtos_id_seq RESTART WITH 0;

-- Conferir
SELECT nextval('produtos_id_seq');

-- Ver informações da tabela
SELECT table_schema, table_name, table_owner 
FROM information_schema.tables 
WHERE table_name = 'produtos';

-- Ver informações da tabela
SELECT table_schema, table_name, table_catalog
FROM information_schema.tables
WHERE table_name = 'produtos';

-- Ver quem é o dono de seq_id
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE tablename = 'produtos';

-- Alterar a propriedade da tabela
ALTER TABLE produtos OWNER TO controle_estoque;

INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito)
VALUES ('Gabriel', 'Categoria Teste', 'Subcategoria Teste', 10, 99.99, 'Catálogo Teste', true);

select * from produtos

delete from produtos

-- ========================= Fazendo produtos para cada usuário ==================

ALTER TABLE produtos ADD COLUMN usuario_id INT;

ALTER TABLE produtos ADD CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id) REFERENCES informacoesLogin(id);


-- Inserir produtos para o usuário 1
INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Caipirinha', 'Drinks de Verão', 'Coquetéis', 15, 19.90, 'Catálogo Verão', false, 1),
('Batida de Morango', 'Drinks de Verão', 'Coquetéis', 20, 24.90, 'Catálogo Verão', true, 1),
('Cerveja', 'Drinks de Verão', 'Coquetéis', 50, 9.99, 'Catálogo Bebidas', false, 1);

-- Inserir produtos para o usuário 2
INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Pastel de Carne', 'Comidas', 'Porções', 30, 12.00, 'Catálogo Salgados', true, 2),
('Coxinha', 'Comidas', 'Porções', 40, 10.50, 'Catálogo Salgados', false, 2),
('Espetinho de Frango', 'Comidas', 'Porções', 25, 14.00, 'Catálogo Churrasco', true, 2);

-- Inserir produtos para o usuário 3
INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Margarita', 'Drinks de Verão', 'Coquetéis', 10, 29.90, 'Catálogo Premium', true, 3),
('Piña Colada', 'Drinks de Verão', 'Coquetéis', 8, 34.90, 'Catálogo Premium', false, 3),
('Suco Natural', 'Drinks de Verão', 'Coquetéis', 25, 12.50, 'Catálogo Saudável', true, 3);

-- Inserir produtos para o usuário 4
INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito, usuario_id)
VALUES 
('Batata Frita', 'Comidas', 'Porções', 35, 15.00, 'Catálogo Snacks', false, 4),
('Pipoca Gourmet', 'Comidas', 'Porções', 20, 18.50, 'Catálogo Premium', true, 4),
('Nachos', 'Comidas', 'Porções', 15, 22.00, 'Catálogo Snacks', false, 4);

SELECT * FROM produtos WHERE usuario_id = 2;

CREATE INDEX idx_usuario_id ON produtos (usuario_id);

-- ===============================================================================

-- ================================= Informações =================================

CREATE TABLE informacoesLogin (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL
);

INSERT INTO informacoesLogin (login, senha, nome, empresa) VALUES
('joao.silva', 'Joao@1234', 'João Silva', 'TechNova Solutions'),
('maria.souza', 'Maria#2024!', 'Maria Souza', 'InovaCorp Ltda'),
('c.almeida', 'Carlos$Adm2024', 'Carlos Almeida', 'Alpha Systems'),
('ana.paula', 'AnaP@ss567', 'Ana Paula', 'VisionSoft Technologies')

SELECT senha FROM informacoesLogin WHERE login = 'aki04';

select * from informacoesLogin

delete from informacoesLogin

ALTER SEQUENCE informacoesLogin_id_seq RESTART WITH 1;

-- ===============================================================================

-- ======================= Logs produtos =========================================

CREATE TABLE IF NOT EXISTS logsProdutos (
    id SERIAL PRIMARY KEY,
    cod_produtos INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao VARCHAR(50) NOT NULL
);

select * from logsProdutos;

--  ============== Função Trigger ================================================

CREATE OR REPLACE FUNCTION log_produtos_acao()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logsProdutos (cod_produtos, acao)
    VALUES (NEW.id, TG_OP);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================================================================

--  ===================== Trigger ================================================

CREATE TRIGGER trigger_log_produtos
AFTER INSERT ON produtos
FOR EACH ROW
EXECUTE FUNCTION log_produtos_acao();


-- ===============================================================================
-- ===============================================================================










CREATE OR REPLACE FUNCTION log_produtos_acao()
RETURNS TRIGGER AS $$
BEGIN
    -- Para INSERT
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO logsProdutos (cod_produtos, acao)
        VALUES (NEW.id, TG_OP);

    -- Para UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO logsProdutos (cod_produtos, acao)
        VALUES (NEW.id, TG_OP);

    -- Para DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO logsProdutos (cod_produtos, acao)
        VALUES (OLD.id, TG_OP);
    END IF;

    RETURN NEW; -- Retorna NEW para INSERT/UPDATE ou OLD para DELETE, conforme necessário.
END;
$$ LANGUAGE plpgsql;






CREATE TRIGGER trg_log_produtos_acao
AFTER INSERT OR UPDATE OR DELETE ON produtos
FOR EACH ROW
EXECUTE FUNCTION log_produtos_acao();
