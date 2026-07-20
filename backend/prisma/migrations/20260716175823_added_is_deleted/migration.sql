-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "wishlists" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
