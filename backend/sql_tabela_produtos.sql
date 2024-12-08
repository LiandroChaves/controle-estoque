-- ================================= Produtos ====================================

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  categoria VARCHAR(255),
  subcategoria VARCHAR(255),
  estoque INT,
  preco DECIMAL(10, 2),
  catalogo VARCHAR(255),
  favorito BOOLEAN DEFAULT FALSE
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

-- ===============================================================================

-- ================================= Informações =================================

CREATE TABLE informacoesLogin (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL
);

insert into informacoesLogin (login, senha, nome, empresa) values ('aki04', '123456','Evandir','Aki Variedades');

SELECT senha FROM informacoesLogin WHERE login = 'aki04';

select * from informacoesLogin

delete from informacoesLogin

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