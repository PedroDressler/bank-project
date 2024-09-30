/*
  Warnings:

  - Made the column `debtor_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiver_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_debtor_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_receiver_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "debtor_id" SET NOT NULL,
ALTER COLUMN "receiver_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
