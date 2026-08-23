-- CreateTable
CREATE TABLE `deals` (
    `id` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `deals_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mandates` (
    `id` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `location_zones_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `posts_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `context` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `creatives` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `hue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `creatives_dealId_idx`(`dealId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visits` (
    `id` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `dealSlugs` JSON NOT NULL,
    `preferredDate` DATETIME(3) NOT NULL,
    `status` ENUM('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    `coordinatorId` VARCHAR(191) NULL,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `visits_coordinatorId_idx`(`coordinatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mandates` ADD CONSTRAINT `mandates_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creatives` ADD CONSTRAINT `creatives_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visits` ADD CONSTRAINT `visits_coordinatorId_fkey` FOREIGN KEY (`coordinatorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

