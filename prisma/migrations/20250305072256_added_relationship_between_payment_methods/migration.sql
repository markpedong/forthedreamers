-- AlterTable
ALTER TABLE "PaymentMethods" ADD COLUMN     "userId" UUID;

-- CreateIndex
CREATE INDEX "PaymentMethods_userId_idx" ON "PaymentMethods"("userId");

-- AddForeignKey
ALTER TABLE "PaymentMethods" ADD CONSTRAINT "PaymentMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
