/*
  Warnings:

  - The primary key for the `Apartment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `contactNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP CONSTRAINT "Apartment_pkey",
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Apartment_id_seq";
