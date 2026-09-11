-- Replace the user full-name field with a unique username plus a display name.
-- Backfill: slugify the old name for the username (collisions get _2, _3, ...), keep the old name as the display name.

ALTER TABLE "user" ADD COLUMN "username" TEXT;
ALTER TABLE "user" ADD COLUMN "displayName" TEXT;

-- Only rows that exist can be backfilled; an empty table just gets the two new columns.
WITH slugged AS (
  SELECT
    "id",
    COALESCE(
      NULLIF(LEFT(TRIM(BOTH '_' FROM REGEXP_REPLACE(LOWER("name"), '[^a-z0-9]+', '_', 'g')), 24), ''),
      'user'
    ) AS base
  FROM "user"
),
numbered AS (
  SELECT
    "id",
    base,
    ROW_NUMBER() OVER (PARTITION BY base ORDER BY "id") AS attempt
  FROM slugged
)
UPDATE "user" u
SET
  "username" = CASE WHEN n.attempt = 1 THEN n.base ELSE n.base || '_' || n.attempt END,
  "displayName" = COALESCE(NULLIF(TRIM(u."name"), ''), 'Dreamer')
FROM numbered n
WHERE u."id" = n."id";

-- A generated `_2` suffix can still collide with a real backfilled handle; resolve deterministically.
UPDATE "user" u
SET "username" = u."username" || '_' || ranks.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "username" ORDER BY "id") AS rn
  FROM "user"
) ranks
WHERE u."id" = ranks."id" AND ranks.rn > 1;

ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "user" ALTER COLUMN "displayName" SET NOT NULL;
ALTER TABLE "user" DROP COLUMN "name";

CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
