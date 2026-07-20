/*
  Warnings:

  - You are about to drop the column `latitude` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `properties` table. All the data in the column will be lost.
  - Added the required column `gMapUrl` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "gMapUrl" TEXT NOT NULL;
