-- DropIndex
DROP INDEX "members_lattes_key";

-- DropIndex
DROP INDEX "members_lsdEmail_key";

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "lsdEmail" DROP NOT NULL,
ALTER COLUMN "lattes" DROP NOT NULL;
