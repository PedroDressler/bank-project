-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_debtor_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_receiver_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "debtor_id" DROP NOT NULL,
ALTER COLUMN "receiver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
