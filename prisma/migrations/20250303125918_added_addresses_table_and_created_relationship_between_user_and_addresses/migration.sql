-- AlterTable
ALTER TABLE "NewsLetter" ADD CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "NewsLetter_id_key";

-- AlterTable
ALTER TABLE "Users" ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Users_id_key";

-- CreateTable
CREATE TABLE "Addresses" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Addresses_userId_idx" ON "Addresses"("userId");

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
