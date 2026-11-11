CREATE DATABASE IF NOT EXISTS talesroom
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

use talesroom;

CREATE TABLE `users` (
  `id` varchar(100) PRIMARY KEY,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20),
  `nickname` varchar(30) NOT NULL,
  `score` integer NOT NULL DEFAULT 0,
  `grade` varchar(20) NOT NULL DEFAULT '방린이',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `posts` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `view_count` integer NOT NULL DEFAULT 0,
  `is_spoiler` tinyint NOT NULL DEFAULT 0,
  `is_notice` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `posts_logs` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `is_spoiler` tinyint NOT NULL,
  `is_notice` tinyint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `post_reactions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `comments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `is_accepted` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `themes` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `title` varchar(150) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `longitude` DECIMAL(10,7),
  `latitude` DECIMAL(10,7),
  `content` text NOT NULL,
  `min_people` tinyint NOT NULL DEFAULT 0,
  `max_people` tinyint NOT NULL DEFAULT 0,
  `play_time` integer NOT NULL DEFAULT 60,
  `difficulty` tinyint NOT NULL,
  `price` integer NOT NULL DEFAULT 0,
  `genre` varchar(50) NOT NULL,
  `thumbnail_url` VARCHAR(2048),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `theme_logs` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `theme_id` integer NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `title` varchar(150) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` DECIMAL(10,7),
  `longitude` DECIMAL(10,7),
  `content` text NOT NULL,
  `min_people` tinyint NOT NULL,
  `max_people` tinyint NOT NULL,
  `play_time` integer NOT NULL,
  `difficulty` tinyint NOT NULL,
  `price` integer NOT NULL,
  `genre` varchar(50) NOT NULL,
  `thumbnail_url` VARCHAR(2048),
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `theme_reviews` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `theme_id` integer NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `rating` tinyint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

-- 모집글 테이블
CREATE TABLE `recruitments` (
  `id`          INT PRIMARY KEY AUTO_INCREMENT,
  `user_id`    VARCHAR(100) NOT NULL,
  `theme_id`    INT NULL,
  `title`       VARCHAR(200) NOT NULL,
  `content`     TEXT NOT NULL,
  `meet_date`   DATETIME NOT NULL,
  `capacity`    INT NOT NULL,
  `status`      VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NULL,
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (theme_id) REFERENCES themes(id)
);


-- 모집 신청(댓글)
CREATE TABLE `recruitment_applications` (
  `id`              INT PRIMARY KEY AUTO_INCREMENT,
  `recruitment_id`  INT NOT NULL,
  `user_id`         VARCHAR(100) NOT NULL,
  `content`         TEXT NOT NULL,
  `status`          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (recruitment_id, user_id),
  FOREIGN KEY (recruitment_id) REFERENCES recruitments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 파티 안에서 댓글
CREATE TABLE `party_comments` (
  `id`             INT PRIMARY KEY AUTO_INCREMENT,
  `recruitment_id`  INT NOT NULL,
  `user_id`        VARCHAR(100) NOT NULL,
  `content`        TEXT NOT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recruitment_id) REFERENCES recruitments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 북마크
CREATE TABLE `bookmarks` (
    `user_id` VARCHAR(100) NOT NULL,
    `theme_id` INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT (now()),

    PRIMARY KEY (user_id, theme_id), -- 유저 id, 테마 id 복합키가 pk

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
);

-- 상품 목록
CREATE TABLE `items` (
    `id`           INT PRIMARY KEY AUTO_INCREMENT,
    `name`         VARCHAR(100) NOT NULL,
    `description`  TEXT,
    `price`        INT NOT NULL,
    `stock`        INT NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT (now()),
    `updated_at` timestamp
);

-- 포인트 교환 
CREATE TABLE `point_exchanges` (
    `id`           INT PRIMARY KEY AUTO_INCREMENT,
    `user_id`      VARCHAR(100) NOT NULL,
    `item_id`      INT NOT NULL,
    `quantity`     INT NOT NULL DEFAULT 1,
    `used_points`  INT NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT (now()),
    `updated_at` timestamp,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);


CREATE UNIQUE INDEX `uk_users_email` ON `users` (`email`);
CREATE UNIQUE INDEX `uk_users_nickname` ON `users` (`nickname`);
CREATE UNIQUE INDEX `uk_post_reactions_post_id_user_id` ON `post_reactions` (`post_id`, `user_id`);
CREATE UNIQUE INDEX `uk_theme_reviews_theme_id_user_id` ON `theme_reviews` (`theme_id`, `user_id`);

ALTER TABLE `posts` ADD CONSTRAINT `fk_posts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `post_reactions` ADD CONSTRAINT `fk_post_reactions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `post_reactions` ADD CONSTRAINT `fk_post_reactions_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

ALTER TABLE `theme_reviews` ADD CONSTRAINT `fk_theme_reviews_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE;
ALTER TABLE `theme_reviews` ADD CONSTRAINT `fk_theme_reviews_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `point_exchanges` ADD CONSTRAINT `fk_point_exchanges_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `point_exchanges` ADD CONSTRAINT `fk_point_exchanges_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

ALTER TABLE `bookmarks` ADD CONSTRAINT `fk_bookmarks_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `bookmarks` ADD CONSTRAINT `fk_bookmarks_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE;

CREATE INDEX `idx_posts_created_at` ON `posts` (`created_at`);
CREATE INDEX `idx_comments_created_at` ON `comments` (`created_at`);
CREATE INDEX `idx_themes_created_at` ON `themes` (`created_at`);
CREATE INDEX `idx_theme_reviews_created_at` ON `theme_reviews` (`created_at`);
