-- Step 1: Add column as nullable
ALTER TABLE "documents" ADD COLUMN "DEK" TEXT;

-- Step 2: Update existing rows and make it NOT NULL
UPDATE "documents" SET "DEK" = '00000' WHERE "DEK" IS NULL;
ALTER TABLE "documents" ALTER COLUMN "DEK" SET NOT NULL;