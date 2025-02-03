/*
  Warnings:

  - You are about to alter the column `cost` on the `OrphanedResource` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrphanedResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "namespace" TEXT,
    "uid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" DATETIME,
    "discoveredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "owner" TEXT,
    "reason" TEXT,
    "cost" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "OrphanedResource_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrphanedResource" ("age", "cost", "createdAt", "deletedAt", "discoveredAt", "id", "kind", "name", "namespace", "owner", "reason", "snapshotId", "status", "uid") SELECT "age", "cost", "createdAt", "deletedAt", "discoveredAt", "id", "kind", "name", "namespace", "owner", "reason", "snapshotId", "status", "uid" FROM "OrphanedResource";
DROP TABLE "OrphanedResource";
ALTER TABLE "new_OrphanedResource" RENAME TO "OrphanedResource";
CREATE INDEX "OrphanedResource_snapshotId_idx" ON "OrphanedResource"("snapshotId");
CREATE INDEX "OrphanedResource_status_idx" ON "OrphanedResource"("status");
CREATE INDEX "OrphanedResource_kind_idx" ON "OrphanedResource"("kind");
CREATE INDEX "OrphanedResource_namespace_idx" ON "OrphanedResource"("namespace");
CREATE INDEX "OrphanedResource_discoveredAt_idx" ON "OrphanedResource"("discoveredAt");
CREATE INDEX "OrphanedResource_deletedAt_idx" ON "OrphanedResource"("deletedAt");
CREATE UNIQUE INDEX "OrphanedResource_snapshotId_uid_key" ON "OrphanedResource"("snapshotId", "uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
