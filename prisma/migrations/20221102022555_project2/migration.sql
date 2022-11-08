-- DropIndex
DROP INDEX "Project_embrapii_code_key";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "embrapii_code" DROP NOT NULL;
