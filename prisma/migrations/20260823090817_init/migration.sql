-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('CP', 'INVESTOR', 'ADMIN') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `firm` VARCHAR(191) NULL,
    `territory` VARCHAR(191) NULL,
    `budget` VARCHAR(191) NULL,
    `interest` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'TERRITORY_LOCKED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_phone_key`(`phone`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investorId` INTEGER NOT NULL,
    `budget` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `locations` VARCHAR(191) NOT NULL,
    `urgency` VARCHAR(191) NOT NULL,
    `note` TEXT NOT NULL,
    `status` ENUM('OPEN', 'PLATFORM_REVERTED', 'MATCHED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `asks_investorId_idx`(`investorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ask_replies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `askId` INTEGER NOT NULL,
    `authorId` INTEGER NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ask_replies_askId_idx`(`askId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creative_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `creative_requests_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seller_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `propertyDetail` VARCHAR(191) NOT NULL,
    `expectedPrice` VARCHAR(191) NULL,
    `status` ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `source` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `stage` ENUM('NEW', 'CONTACTED', 'FOLLOW_UP', 'VISIT_SCHEDULED', 'HOT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST') NOT NULL DEFAULT 'NEW',
    `assigneeId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `leads_assigneeId_idx`(`assigneeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `cityLabel` VARCHAR(191) NOT NULL,
    `microLocation` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `purpose` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `badges` JSON NOT NULL,
    `price` INTEGER NOT NULL,
    `priceMax` INTEGER NULL,
    `pricePerUnit` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `benchmarkPerUnit` INTEGER NOT NULL,
    `sizes` JSON NOT NULL,
    `areaLabel` VARCHAR(191) NOT NULL,
    `facing` VARCHAR(191) NULL,
    `roadWidth` VARCHAR(191) NULL,
    `possession` VARCHAR(191) NOT NULL,
    `approval` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `upsideNote` VARCHAR(191) NOT NULL,
    `highlights` JSON NOT NULL,
    `whyStandsOut` JSON NOT NULL,
    `locationAdvantages` JSON NOT NULL,
    `demandDrivers` JSON NOT NULL,
    `suitsWho` JSON NOT NULL,
    `overview` TEXT NOT NULL,
    `bookingAmount` INTEGER NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `hot` BOOLEAN NOT NULL DEFAULT false,
    `investorPick` BOOLEAN NOT NULL DEFAULT false,
    `newListing` BOOLEAN NOT NULL DEFAULT false,
    `mapX` INTEGER NOT NULL,
    `mapY` INTEGER NOT NULL,
    `hue` INTEGER NOT NULL,
    `faqs` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `deals_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mandates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealId` INTEGER NOT NULL,
    `commission` VARCHAR(191) NOT NULL,
    `mandateType` VARCHAR(191) NOT NULL,
    `validity` VARCHAR(191) NOT NULL,
    `investorNote` TEXT NOT NULL,
    `urgent` BOOLEAN NOT NULL DEFAULT false,
    `kit` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mandates_dealId_key`(`dealId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_zones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NOT NULL,
    `overview` TEXT NOT NULL,
    `maturity` VARCHAR(191) NOT NULL,
    `growthScore` INTEGER NOT NULL,
    `priceBand` VARCHAR(191) NOT NULL,
    `avgPerSqYd` VARCHAR(191) NOT NULL,
    `idealBuyer` JSON NOT NULL,
    `whyBuy` JSON NOT NULL,
    `connectivity` JSON NOT NULL,
    `trend` JSON NOT NULL,
    `mapX` INTEGER NOT NULL,
    `mapY` INTEGER NOT NULL,
    `hue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `location_zones_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `readMins` INTEGER NOT NULL,
    `body` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `posts_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote` TEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `context` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creatives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `dealId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `hue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `creatives_dealId_idx`(`dealId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `dealSlugs` JSON NOT NULL,
    `preferredDate` DATETIME(3) NOT NULL,
    `status` ENUM('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    `coordinatorId` INTEGER NULL,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `visits_coordinatorId_idx`(`coordinatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asks` ADD CONSTRAINT `asks_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ask_replies` ADD CONSTRAINT `ask_replies_askId_fkey` FOREIGN KEY (`askId`) REFERENCES `asks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ask_replies` ADD CONSTRAINT `ask_replies_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creative_requests` ADD CONSTRAINT `creative_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mandates` ADD CONSTRAINT `mandates_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creatives` ADD CONSTRAINT `creatives_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visits` ADD CONSTRAINT `visits_coordinatorId_fkey` FOREIGN KEY (`coordinatorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

