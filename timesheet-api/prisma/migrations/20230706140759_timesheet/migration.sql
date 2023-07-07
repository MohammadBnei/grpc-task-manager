-- CreateTable
CREATE TABLE `Timesheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(191) NOT NULL,
    `end_date` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `locatioon` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
