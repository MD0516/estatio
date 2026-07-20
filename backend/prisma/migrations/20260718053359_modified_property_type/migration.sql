/*
  Warnings:

  - The values [rent,lease,sale] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_deleted` on the `inquiries` table. All the data in the column will be lost.
  - Added the required column `listingType` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('rent', 'lease', 'sale');

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('apartment', 'villa', 'house', 'plot', 'commercial');
ALTER TABLE "properties" ALTER COLUMN "type" TYPE "PropertyType_new" USING ("type"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "public"."PropertyType_old";
COMMIT;

-- AlterTable
ALTER TABLE "inquiries" DROP COLUMN "is_deleted";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "listingType" "ListingType" NOT NULL;
