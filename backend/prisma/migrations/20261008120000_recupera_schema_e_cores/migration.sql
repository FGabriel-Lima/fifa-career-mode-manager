-- DropForeignKey
ALTER TABLE "carreiras" DROP CONSTRAINT "carreiras_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "temporadas" DROP CONSTRAINT "temporadas_carreira_id_fkey";

-- DropForeignKey
ALTER TABLE "jogadores" DROP CONSTRAINT "jogadores_carreira_id_fkey";

-- DropForeignKey
ALTER TABLE "elenco_temporada" DROP CONSTRAINT "elenco_temporada_jogador_id_fkey";

-- DropForeignKey
ALTER TABLE "elenco_temporada" DROP CONSTRAINT "elenco_temporada_temporada_id_fkey";

-- DropForeignKey
ALTER TABLE "transferencias" DROP CONSTRAINT "transferencias_temporada_id_fkey";

-- DropForeignKey
ALTER TABLE "transferencias" DROP CONSTRAINT "transferencias_jogador_id_fkey";

-- DropForeignKey
ALTER TABLE "observacao" DROP CONSTRAINT "observacao_carreira_id_fkey";

-- DropForeignKey
ALTER TABLE "titulos_conquistados" DROP CONSTRAINT "titulos_conquistados_temporada_id_fkey";

-- DropForeignKey
ALTER TABLE "ligas_temporada" DROP CONSTRAINT "ligas_temporada_temporada_id_fkey";

-- DropForeignKey
ALTER TABLE "classificacao_equipe" DROP CONSTRAINT "classificacao_equipe_liga_temporada_id_fkey";

-- DropForeignKey
ALTER TABLE "premios_temporada" DROP CONSTRAINT "premios_temporada_temporada_id_fkey";

-- AlterTable
ALTER TABLE "temporadas" ADD COLUMN     "cor_primaria" VARCHAR(7),
ADD COLUMN     "cor_secundaria" VARCHAR(7);

-- AlterTable
ALTER TABLE "jogadores" ADD COLUMN     "total_assistencias" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_gols" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_jogos" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "titulos_conquistados" ADD COLUMN     "clube_vice" VARCHAR(100);

-- AlterTable
ALTER TABLE "candidatos_premio" DROP COLUMN "assist_copas",
DROP COLUMN "assist_liga",
DROP COLUMN "ganhou_copa_continental",
DROP COLUMN "ganhou_copa_nacional",
DROP COLUMN "gols_copas",
DROP COLUMN "gols_liga",
ADD COLUMN     "assist_champions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ganhou_champions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gols_champions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vice_champions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vice_liga" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "nome_jogador" SET DATA TYPE TEXT,
ALTER COLUMN "clube" SET DATA TYPE TEXT,
ALTER COLUMN "ganhou_liga" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "carreiras" ADD CONSTRAINT "carreiras_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temporadas" ADD CONSTRAINT "temporadas_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_temporada" ADD CONSTRAINT "elenco_temporada_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elenco_temporada" ADD CONSTRAINT "elenco_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias" ADD CONSTRAINT "transferencias_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacao" ADD CONSTRAINT "observacao_carreira_id_fkey" FOREIGN KEY ("carreira_id") REFERENCES "carreiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos_conquistados" ADD CONSTRAINT "titulos_conquistados_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligas_temporada" ADD CONSTRAINT "ligas_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificacao_equipe" ADD CONSTRAINT "classificacao_equipe_liga_temporada_id_fkey" FOREIGN KEY ("liga_temporada_id") REFERENCES "ligas_temporada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premios_temporada" ADD CONSTRAINT "premios_temporada_temporada_id_fkey" FOREIGN KEY ("temporada_id") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

