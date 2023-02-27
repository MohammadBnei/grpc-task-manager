/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `refreshToken` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RefreshToken` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `refreshToken` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`refreshToken`);
