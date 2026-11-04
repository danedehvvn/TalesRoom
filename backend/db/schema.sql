CREATE TABLE `users` (
  `id` varchar(100) PRIMARY KEY,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20),
  `nickname` varchar(30) NOT NULL,
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
  `map_url` varchar(500),
  `content` text NOT NULL,
  `min_people` tinyint NOT NULL DEFAULT 0,
  `max_people` tinyint NOT NULL DEFAULT 0,
  `play_time` integer NOT NULL DEFAULT 60,
  `difficulty` tinyint NOT NULL,
  `price` integer NOT NULL DEFAULT 0,
  `genre` varchar(50) NOT NULL,
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
  `map_url` varchar(500),
  `content` text NOT NULL,
  `min_people` tinyint NOT NULL,
  `max_people` tinyint NOT NULL,
  `play_time` integer NOT NULL,
  `difficulty` tinyint NOT NULL,
  `price` integer NOT NULL,
  `genre` varchar(50) NOT NULL,
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

CREATE UNIQUE INDEX `uk_users_email` ON `users` (`email`);
CREATE UNIQUE INDEX `uk_users_nickname` ON `users` (`nickname`);
CREATE UNIQUE INDEX `uk_posts_accepted_id` ON `posts` (`accepted_id`);
CREATE UNIQUE INDEX `uk_post_reactions_post_id_user_id` ON `post_reactions` (`post_id`, `user_id`);
CREATE UNIQUE INDEX `uk_theme_reviews_theme_id_user_id` ON `theme_reviews` (`theme_id`, `user_id`);

ALTER TABLE `posts` ADD CONSTRAINT `fk_posts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `posts` ADD CONSTRAINT `fk_posts_accepted_id` FOREIGN KEY (`accepted_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL;

ALTER TABLE `post_reactions` ADD CONSTRAINT `fk_post_reactions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `post_reactions` ADD CONSTRAINT `fk_post_reactions_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `comments` ADD CONSTRAINT `fk_comments_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

ALTER TABLE `theme_reviews` ADD CONSTRAINT `fk_theme_reviews_theme_id` FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE;
ALTER TABLE `theme_reviews` ADD CONSTRAINT `fk_theme_reviews_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
