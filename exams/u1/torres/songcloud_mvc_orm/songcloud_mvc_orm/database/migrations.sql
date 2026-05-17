CREATE TABLE IF NOT EXISTS songs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    artist VARCHAR(120) NOT NULL,
    album VARCHAR(120) NULL,
    genre VARCHAR(80) NOT NULL,
    duration_seconds INT UNSIGNED NOT NULL,
    release_year SMALLINT UNSIGNED NOT NULL,
    streams BIGINT UNSIGNED NOT NULL DEFAULT 0,
    likes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    rating DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    explicit_content TINYINT(1) NOT NULL DEFAULT 0,
    royalty_per_stream DECIMAL(10,6) NOT NULL DEFAULT 0.003500,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_song_search (title, artist, genre),
    INDEX idx_song_release_year (release_year),
    INDEX idx_song_streams (streams)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
