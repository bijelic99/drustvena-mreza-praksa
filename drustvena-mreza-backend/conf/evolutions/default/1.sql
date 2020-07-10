# --- !Ups

    CREATE TABLE `user` (
      `id` binary(16) NOT NULL,
      `username` text NOT NULL,
      `password` text NOT NULL,
      `first_name` text,
      `last_name` text,
      `email` text NOT NULL,
      `registered_at` text NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT INTO `user` (`id`, `username`, `password`, `first_name`, `last_name`, `email`, `registered_at`) VALUES
        (0x0ff5cd7e81364250bc0f68355eab4cf5, 'u1', 'pwd', 'John', 'Doe', 'john.doe@gmail.com', '2020-06-25T15:57:50.561'),
        (0x10841785a89d45669d62a5130be1d2f5, 'u2', 'pwd', 'Jack', 'Doe', 'jack.doe@gmail.com', '2020-06-25T15:58:11.372'),
        (0xb955830a01a14438b81006af5c4d0084, 'u3', 'pwd', 'John', 'Dooe', 'john.dooe@gmail.com', '2020-06-25T15:58:38.374');

    ALTER TABLE `user`
        ADD PRIMARY KEY (`id`),
        ADD UNIQUE KEY `username` (`username`) USING HASH,
        ADD UNIQUE KEY `email` (`email`) USING HASH;

    CREATE TABLE `status` (
      `id` binary(16) NOT NULL,
      `user_id` binary(16) NOT NULL,
      `created_at` text NOT NULL,
      `contents` text NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT INTO `status` (`id`, `user_id`, `created_at`, `contents`) VALUES
        (0x3785efd4055641d5ac48f2a07676ffae, 0x0ff5cd7e81364250bc0f68355eab4cf5, '2020-06-26T09:38:50.345', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla gravida, elit vel tincidunt maximus, purus ante commodo elit, ut aliquet dui leo vel nulla. Ut pellentesque felis arcu, nec consectetur arcu facilisis auctor. Etiam venenatis ac justo eget hendrerit. In mi est, tristique at metus tristique, aliquam convallis nisl. Morbi at tempus turpis. In rutrum tincidunt nunc, nec finibus nisi porta in. Quisque eu lectus ac mauris pulvinar blandit vitae vitae diam. Integer nec mi a nulla mattis rutrum id lacinia libero. Duis ac vehicula ex, sed pulvinar elit. Aenean ut pretium nisi. Mauris maximus ante ut mauris ullamcorper mollis.'),
        (0xb76ca3b4584142dca83e0c3b77bdcb8a, 0x10841785a89d45669d62a5130be1d2f5, '2020-06-26T09:39:24.477', 'Vestibulum et ultrices velit, ullamcorper lacinia tellus. Aenean venenatis pretium elit. Suspendisse potenti. Curabitur rutrum diam quis pharetra imperdiet. Aenean erat ipsum, commodo vitae aliquet a, tempor non elit. Nunc aliquam egestas varius. Sed fringilla ante ut nunc porttitor, vitae luctus orci fringilla. Quisque sit amet scelerisque orci, in molestie turpis. Suspendisse id sodales dui.'),
        (0xedfd7e8a1c9246f8b470e9f0110e2e37, 0xb955830a01a14438b81006af5c4d0084, '2020-06-26T09:39:35.682', 'Cras viverra nulla ac tellus accumsan, at fringilla erat tristique. Nullam in massa at elit tincidunt interdum. Quisque lacinia elementum elementum. Ut nec nunc mi. Etiam eleifend convallis odio, ut pharetra neque molestie eget. Morbi in scelerisque augue. Morbi id convallis purus. Phasellus laoreet, ex at commodo dignissim, tellus odio rutrum magna, et placerat nibh diam id eros. Mauris vitae semper turpis. Etiam eget maximus mauris, eu consequat nunc. Etiam magna dui, dignissim pulvinar dui at, sollicitudin sagittis ex. Vestibulum aliquet augue maximus odio aliquet aliquet.');

    ALTER TABLE `status`
        ADD CONSTRAINT `status_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;

    ALTER TABLE `status`
        ADD PRIMARY KEY (`id`),
        ADD KEY `user_fk` (`user_id`);

    CREATE TABLE `status_like` (
      `status_id` binary(16) NOT NULL,
      `user_id` binary(16) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT INTO `status_like` (`status_id`, `user_id`)
        VALUES(0xb76ca3b4584142dca83e0c3b77bdcb8a, 0x0ff5cd7e81364250bc0f68355eab4cf5);
    INSERT INTO `status_like` (`status_id`, `user_id`)
            VALUES(0x3785efd4055641d5ac48f2a07676ffae, 0x10841785a89d45669d62a5130be1d2f5);

    ALTER TABLE `status_like`
        ADD PRIMARY KEY (`status_id`,`user_id`);

    ALTER TABLE `status_like`

        ADD CONSTRAINT `status_like_fk` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;


    CREATE TABLE `photo` (
      `id` binary(16) NOT NULL,
      `user_id` binary(16) NOT NULL,
      `picture` blob NOT NULL,
      `mime_type` text
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    ALTER TABLE `photo`
        ADD PRIMARY KEY (`id`);

    ALTER TABLE `photo`
        ADD CONSTRAINT `user_photo_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;

    CREATE TABLE `friend_request` (
      `sender` binary(16) NOT NULL,
      `recipient` binary(16) NOT NULL,
      `created_at` text NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    ALTER TABLE `friend_request`
        ADD PRIMARY KEY (`sender`,`recipient`);

    ALTER TABLE `friend_request`
        ADD CONSTRAINT `user_sender_fk` FOREIGN KEY (`sender`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE `friend_request`
        ADD CONSTRAINT `user_recipient_fk` FOREIGN KEY (`recipient`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;


    CREATE TABLE `friendship` (
      `first_user` binary(16) NOT NULL,
      `second_user` binary(16) NOT NULL,
      `created_at` text NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


    ALTER TABLE `friendship`
        ADD PRIMARY KEY (`first_user`,`second_user`);

    ALTER TABLE `friendship`
        ADD CONSTRAINT `user_first_user_fk` FOREIGN KEY (`first_user`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;

    ALTER TABLE `friendship`
        ADD CONSTRAINT `user_second_user_fk` FOREIGN KEY (`second_user`) REFERENCES `user` (`id`)
            ON DELETE CASCADE ON UPDATE NO ACTION;



# --- !Downs

    ALTER TABLE `friendship` DROP CONSTRAINT `user_first_user_fk`;
    ALTER TABLE `friendship` DROP CONSTRAINT `user_second_user_fk`;
    ALTER TABLE `friend_request` DROP CONSTRAINT `user_sender_fk`;
    ALTER TABLE `friend_request` DROP CONSTRAINT `user_recipient_fk`;
    ALTER TABLE `photo` DROP CONSTRAINT `user_photo_fk`;
    ALTER TABLE `status_like` DROP CONSTRAINT `status_like_fk`;
    ALTER TABLE `status` DROP CONSTRAINT `status_user_fk`;

    DROP TABLE `friendship` IF EXISTS;
    DROP TABLE `friend_request` IF EXISTS;
    DROP TABLE `photo` IF EXISTS;
    DROP TABLE `status_like` IF EXISTS;
    DROP TABLE `status` IF EXISTS;
    DROP TABLE `user` IF EXISTS;


