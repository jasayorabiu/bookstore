-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recoverCode" TEXT,
ADD COLUMN     "twoFactorSecret" TEXT;
