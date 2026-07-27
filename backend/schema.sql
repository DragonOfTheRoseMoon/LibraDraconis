-- LibraDraconis schema
-- Enable foreign key enforcement (off by default in SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS books (
    uuid            TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    series          TEXT,
    series_position INTEGER,
    isbn            TEXT,
    format          TEXT CHECK (format IN ('book', 'ebook', 'audiobook')),
    status          TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    has_image       INTEGER NOT NULL DEFAULT 0 CHECK (has_image IN (0, 1))
);

CREATE TABLE IF NOT EXISTS wishlist (
    uuid            TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    series          TEXT,
    series_position INTEGER,
    isbn            TEXT,
    format          TEXT CHECK (format IN ('book', 'ebook', 'audiobook')),
    list_add_date   TEXT,
    approx_cost     REAL,
    has_image       INTEGER NOT NULL DEFAULT 0 CHECK (has_image IN (0, 1))
);

CREATE TABLE IF NOT EXISTS authors (
    uuid TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS book_authors (
    book_uuid   TEXT NOT NULL,
    author_uuid TEXT NOT NULL,
    PRIMARY KEY (book_uuid, author_uuid),
    FOREIGN KEY (book_uuid) REFERENCES books(uuid) ON DELETE CASCADE,
    FOREIGN KEY (author_uuid) REFERENCES authors(uuid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlist_authors (
    wishlist_uuid TEXT NOT NULL,
    author_uuid   TEXT NOT NULL,
    PRIMARY KEY (wishlist_uuid, author_uuid),
    FOREIGN KEY (wishlist_uuid) REFERENCES wishlist(uuid) ON DELETE CASCADE,
    FOREIGN KEY (author_uuid) REFERENCES authors(uuid) ON DELETE CASCADE
);

-- Indexes on junction table FKs (not automatic, needed to avoid full scans on join)
CREATE INDEX IF NOT EXISTS idx_book_authors_book ON book_authors(book_uuid);
CREATE INDEX IF NOT EXISTS idx_book_authors_author ON book_authors(author_uuid);
CREATE INDEX IF NOT EXISTS idx_wishlist_authors_wishlist ON wishlist_authors(wishlist_uuid);
CREATE INDEX IF NOT EXISTS idx_wishlist_authors_author ON wishlist_authors(author_uuid);
