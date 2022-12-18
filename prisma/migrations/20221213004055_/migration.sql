/*
  Warnings:

  - The `oldValue` column on the `ActivityRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `newValue` on the `ActivityRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "newValue",
ADD COLUMN     "newValue" JSONB NOT NULL,
DROP COLUMN "oldValue",
ADD COLUMN     "oldValue" JSONB;
