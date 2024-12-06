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