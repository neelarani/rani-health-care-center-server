/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `doctor_specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor_specialties" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "contactNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_id_key" ON "patients"("id");
