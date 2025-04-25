-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "background" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
