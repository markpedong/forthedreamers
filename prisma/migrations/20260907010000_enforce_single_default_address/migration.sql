-- Normalize existing rows before enforcing one default address per user.
WITH ranked_defaults AS (
    SELECT "id", ROW_NUMBER() OVER (
        PARTITION BY "userId"
        ORDER BY "updatedAt" DESC, "id"
    ) AS rank
    FROM "address"
    WHERE "isDefault" = true
)
UPDATE "address"
SET "isDefault" = false
FROM ranked_defaults
WHERE "address"."id" = ranked_defaults."id"
  AND ranked_defaults.rank > 1;

WITH first_addresses AS (
    SELECT DISTINCT ON ("userId") "id"
    FROM "address"
    WHERE "userId" NOT IN (
        SELECT "userId" FROM "address" WHERE "isDefault" = true
    )
    ORDER BY "userId", "updatedAt" DESC, "id"
)
UPDATE "address"
SET "isDefault" = true
FROM first_addresses
WHERE "address"."id" = first_addresses."id";

CREATE UNIQUE INDEX "address_one_default_per_user"
ON "address" ("userId")
WHERE "isDefault" = true;
