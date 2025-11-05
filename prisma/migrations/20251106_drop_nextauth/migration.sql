-- Drop legacy NextAuth foreign keys
ALTER TABLE "watchlist" DROP CONSTRAINT IF EXISTS "watchlist_userId_fkey";
ALTER TABLE "watched" DROP CONSTRAINT IF EXISTS "watched_userId_fkey";
ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_userId_fkey";
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_userId_fkey";

-- Remove deprecated NextAuth tables
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "verificationtokens" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Recreate foreign keys pointing to Supabase auth schema
ALTER TABLE "watchlist"
  ADD CONSTRAINT "watchlist_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "auth"."users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "watched"
  ADD CONSTRAINT "watched_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "auth"."users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
