/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `blacklist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `blacklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blacklist" ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_refreshToken_key" ON "blacklist"("refreshToken");
