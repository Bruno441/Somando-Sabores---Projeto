-- ============================================
-- Script de Criação do Banco de Dados
-- Projeto: Somando Sabores
-- Database: PostgreSQL 15+
-- ============================================

-- Limpar banco (CUIDADO: Remove tudo!)
-- Descomente apenas se quiser resetar o banco completamente
-- DROP TABLE IF EXISTS TB_PAGAMENTOS CASCADE;
-- DROP TABLE IF EXISTS TB_CONVIDADOS CASCADE;
-- DROP TABLE IF EXISTS TB_RESERVAS CASCADE;
-- DROP TABLE IF EXISTS TB_PACOTES CASCADE;
-- DROP TABLE IF EXISTS TB_EVENTOS CASCADE;
-- DROP TABLE IF EXISTS TB_ALUNOS CASCADE;
-- DROP TABLE IF EXISTS TB_PRECIFICACAO CASCADE;
-- DROP TABLE IF EXISTS TB_CLIENTES CASCADE;
-- DROP TYPE IF EXISTS opcoes_servico CASCADE;
-- DROP TYPE IF EXISTS status_pagamento CASCADE;

-- ============================================
-- 1. Criar Tipos ENUM
-- ============================================

CREATE TYPE opcoes_servico AS ENUM ('pacote', 'reserva');
CREATE TYPE status_pagamento AS ENUM ('pendente', 'confirmado', 'cancelado', 'concluida', 'atrasada', 'reembolsada');

-- ============================================
-- 2. Criar Tabelas
-- ============================================

-- Tabela de Clientes
CREATE TABLE TB_CLIENTES(
    id_cliente UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Eventos
CREATE TABLE TB_EVENTOS(
    id_evento UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    data_evento DATE NOT NULL,
    detalhes VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES TB_CLIENTES(id_cliente) ON DELETE CASCADE
);

-- Tabela de Alunos
CREATE TABLE TB_ALUNOS(
    id_aluno UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    ra VARCHAR(8) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES TB_CLIENTES(id_cliente) ON DELETE CASCADE
);

-- Tabela de Precificação
CREATE TABLE TB_PRECIFICACAO(
    id_precificacao UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_servico opcoes_servico NOT NULL,
    quantidade INT NOT NULL,
    status_precificacao status_pagamento NOT NULL DEFAULT 'pendente',
    total NUMERIC(10, 2) NOT NULL CHECK(total > 0), 
    emitir_nf BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pacotes
CREATE TABLE TB_PACOTES(
    id_pacote UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aluno_id UUID NOT NULL,
    precificacao_id UUID NOT NULL,
    data_inicio DATE NOT NULL,
    data_final DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES TB_ALUNOS(id_aluno) ON DELETE CASCADE,
    FOREIGN KEY (precificacao_id) REFERENCES TB_PRECIFICACAO(id_precificacao) ON DELETE CASCADE
);

-- Tabela de Reservas
CREATE TABLE TB_RESERVAS(
    id_reserva UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    precificacao_id UUID NOT NULL,
    qtd_convidados INT NOT NULL DEFAULT 0,
    data_reserva DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES TB_CLIENTES(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (precificacao_id) REFERENCES TB_PRECIFICACAO(id_precificacao) ON DELETE CASCADE
);

-- Tabela de Convidados
CREATE TABLE TB_CONVIDADOS(
    id_convidado UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reserva_id UUID NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES TB_RESERVAS(id_reserva) ON DELETE CASCADE
);

-- Tabela de Pagamentos
CREATE TABLE TB_PAGAMENTOS(
    id_pagamento UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL,
    reserva_id UUID,
    pacote_id UUID,
    forma_pagamento VARCHAR(35) NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL CHECK(valor_total > 0), 
    data_pagamento DATE NOT NULL,
    asaas_id VARCHAR(40) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES TB_CLIENTES(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES TB_RESERVAS(id_reserva) ON DELETE SET NULL,
    FOREIGN KEY (pacote_id) REFERENCES TB_PACOTES(id_pacote) ON DELETE SET NULL
);

-- ============================================
-- 3. Criar Índices para Performance
-- ============================================

CREATE INDEX idx_clientes_email ON TB_CLIENTES(email);
CREATE INDEX idx_eventos_cliente_id ON TB_EVENTOS(cliente_id);
CREATE INDEX idx_eventos_data ON TB_EVENTOS(data_evento);
CREATE INDEX idx_alunos_cliente_id ON TB_ALUNOS(cliente_id);
CREATE INDEX idx_alunos_ra ON TB_ALUNOS(ra);
CREATE INDEX idx_reservas_cliente_id ON TB_RESERVAS(cliente_id);
CREATE INDEX idx_reservas_data ON TB_RESERVAS(data_reserva);
CREATE INDEX idx_convidados_reserva_id ON TB_CONVIDADOS(reserva_id);
CREATE INDEX idx_pacotes_aluno_id ON TB_PACOTES(aluno_id);
CREATE INDEX idx_pagamentos_cliente_id ON TB_PAGAMENTOS(cliente_id);
CREATE INDEX idx_pagamentos_asaas_id ON TB_PAGAMENTOS(asaas_id);

-- ============================================
-- 4. Verificar criação das tabelas
-- ============================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================
-- Script concluído com sucesso!
-- ============================================
