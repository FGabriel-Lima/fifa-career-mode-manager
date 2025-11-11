-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreiras" (
    "id" SERIAL NOT NULL,
    "nome_carreira" VARCHAR(100) NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "carreiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temporadas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "clube_nome" VARCHAR(100) NOT NULL,
    "orcamento_transferencia" DECIMAL(65,30) DEFAULT 0,
    "orcamento_salarios" DECIMAL(65,30) DEFAULT 0,
    "carreira_id" INTEGER NOT NULL,

    CONSTRAINT "temporadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogadores" (
    "id" SERIAL NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "posicao" VARCHAR(10) NOT NULL,
    "nacionalidade" VARCHAR(50),
    "carreira_id" INTEGER NOT NULL,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elenco_temporada" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "temporada_id" INTEGER NOT NULL,
    "overall" INTEGER NOT NULL,
    "idade" INTEGER NOT NULL,
    "valor_mercado" DECIMAL(65,30) DEFAULT 0,
    "jogos_disputados" INTEGER DEFAULT 0,
    "gols" INTEGER DEFAULT 0,
    "assistencias" INTEGER DEFAULT 0,

    CONSTRAINT "elenco_temporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferencias" (
    "id" SERIAL NOT NULL,
    "temporada_id" INTEGER NOT NULL,
    "jogador_id" INTEGER,
    "tipo_transferencia" VARCHAR(10) NOT NULL,
    "nome_jogador_externo" VARCHAR(100),
    "time_origem" VARCHAR(100),
    "time_destino" VARCHAR(100),
    "valor_transferencia" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "data_transferencia" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transferencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacao" (
    "id" SERIAL NOT NULL,
    "carreira_id" INTEGER NOT NULL,
    "nome_jogador" VARCHAR(100) NOT NULL,
    "clube_atual" VARCHAR(100),
    "idade_aprox" INTEGER,
    "posicao" VARCHAR(10),
    "notas" TEXT,

    CONSTRAINT "observacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulos_conquistados" (
    "id" SERIAL NOT NULL,
    "temporada_id" INTEGER NOT NULL,
    "nome_titulo" VARCHAR(100) NOT NULL,
    "clube_vencedor" VARCHAR(100) NOT NULL,

    CONSTRAINT "titulos_conquistados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ligas_temporada" (
    "id" SERIAL NOT NULL,
    "temporada_id" INTEGER NOT NULL,
    "nome_liga" VARCHAR(100) NOT NULL,

    CONSTRAINT "ligas_temporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classificacao_equipe" (
    "id" SERIAL NOT NULL,
    "liga_temporada_id" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "nome_time" VARCHAR(100) NOT NULL,
    "pontos" INTEGER NOT NULL,
    "vitorias" INTEGER DEFAULT 0,
    "empates" INTEGER DEFAULT 0,
    "derrotas" INTEGER DEFAULT 0,
    "gols_pro" INTEGER DEFAULT 0,
    "gols_contra" INTEGER DEFAULT 0,

    CONSTRAINT "classificacao_equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premios_temporada" (
    "id" SERIAL NOT NULL,
    "temporada_id" INTEGER NOT NULL,
    "nome_premio" VARCHAR(100) NOT NULL DEFAULT 'Melhor do Mundo (CM)',
    "vencedor_nome" VARCHAR(100),
    "vencedor_clube" VARCHAR(100),

    CONSTRAINT "premios_temporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatos_premio" (
    "id" SERIAL NOT NULL,
    "premio_id" INTEGER NOT NULL,
    "nome_jogador" VARCHAR(100) NOT NULL,
    "clube" VARCHAR(100) NOT NULL,
    "gols_liga" INTEGER DEFAULT 0,
    "assist_liga" INTEGER DEFAULT 0,
    "gols_copas" INTEGER DEFAULT 0,
    "assist_copas" INTEGER DEFAULT 0,
    "ganhou_liga" BOOLEAN DEFAULT false,
    "ganhou_copa_nacional" BOOLEAN DEFAULT false,
    "ganhou_copa_continental" BOOLEAN DEFAULT false,
    "jogador_id" INTEGER,

    CONSTRAINT "candidatos_premio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "premios_temporada_temporada_id_key" ON "premios_temporada"("temporada_id");

-- AddForeignKey
ALTER TABLE "carreiras" ADD CONSTRAINT "carreiras_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temporadas" ADD CONSTRAINT "temporadas_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_temporada" ADD CONSTRAINT "elenco_temporada_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_temporada" ADD CONSTRAINT "elenco_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacao" ADD CONSTRAINT "observacao_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos_conquistados" ADD CONSTRAINT "titulos_conquistados_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligas_temporada" ADD CONSTRAINT "ligas_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificacao_equipe" ADD CONSTRAINT "classificacao_equipe_liga_temporada_id_fkey" FOREIGN KEY ("liga_temporada_id") REFERENCES "ligas_temporada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premios_temporada" ADD CONSTRAINT "premios_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatos_premio" ADD CONSTRAINT "candidatos_premio_premio_id_fkey" FOREIGN KEY ("premio_id") REFERENCES "premios_temporada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatos_premio" ADD CONSTRAINT "candidatos_premio_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
