-- Drop existing tables completely
DROP TABLE IF EXISTS "watchlist" CASCADE;
DROP TABLE IF EXISTS "watched" CASCADE;

-- Recreate watchlist table with correct FK to auth.users
CREATE TABLE "watchlist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "contentId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "watchlist_userId_contentId_mediaType_seasonNumber_key" UNIQUE ("userId", "contentId", "mediaType", "seasonNumber")
);

-- Recreate watched table with correct FK to auth.users
CREATE TABLE "watched" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "contentId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER,

    CONSTRAINT "watched_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "watched_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "watched_userId_contentId_mediaType_seasonNumber_key" UNIQUE ("userId", "contentId", "mediaType", "seasonNumber")
);

-- Create indexes for better query performance
CREATE INDEX "watchlist_userId_idx" ON "watchlist"("userId");
CREATE INDEX "watched_userId_idx" ON "watched"("userId");
