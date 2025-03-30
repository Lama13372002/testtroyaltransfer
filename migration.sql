-- Проверяем существование таблицы SiteSettings
CREATE TABLE IF NOT EXISTS `SiteSettings` (
  `id` INT NOT NULL DEFAULT 1,
  `phone` VARCHAR(255) NOT NULL DEFAULT '+7 (900) 000-00-00',
  `email` VARCHAR(255) NOT NULL DEFAULT 'info@royaltransfer.ru',
  `address` VARCHAR(255) NOT NULL DEFAULT 'г. Калининград, ул. Примерная, д. 123',
  `workingHours` VARCHAR(255) NOT NULL DEFAULT 'Пн-Вс: 24/7',
  `companyName` VARCHAR(255) NOT NULL DEFAULT 'RoyalTransfer',
  `companyDesc` TEXT NOT NULL, -- БЕЗ DEFAULT!
  `instagramLink` VARCHAR(255) NOT NULL DEFAULT '#',
  `telegramLink` VARCHAR(255) NOT NULL DEFAULT '#',
  `whatsappLink` VARCHAR(255) NOT NULL DEFAULT '#',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Если таблица уже существует, добавляем новые поля
ALTER TABLE `SiteSettings` 
ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT 'info@royaltransfer.ru',
ADD COLUMN `address` VARCHAR(255) NOT NULL DEFAULT 'г. Калининград, ул. Примерная, д. 123',
ADD COLUMN `workingHours` VARCHAR(255) NOT NULL DEFAULT 'Пн-Вс: 24/7',
ADD COLUMN `companyName` VARCHAR(255) NOT NULL DEFAULT 'RoyalTransfer',
ADD COLUMN `companyDesc` TEXT NOT NULL, -- БЕЗ DEFAULT!
ADD COLUMN `instagramLink` VARCHAR(255) NOT NULL DEFAULT '#',
ADD COLUMN `telegramLink` VARCHAR(255) NOT NULL DEFAULT '#',
ADD COLUMN `whatsappLink` VARCHAR(255) NOT NULL DEFAULT '#';