/*
  Warnings:

  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `transactions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");
