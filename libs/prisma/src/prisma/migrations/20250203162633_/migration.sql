-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cluster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "token" TEXT,
    "registrationId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "nodes" INTEGER,
    "score" INTEGER,
    "lastSeen" DATETIME,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cluster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cluster" ("createdAt", "id", "lastSeen", "name", "nodes", "registrationId", "score", "status", "token", "updatedAt", "userId", "version") SELECT "createdAt", "id", "lastSeen", "name", "nodes", "registrationId", "score", "status", "token", "updatedAt", "userId", "version" FROM "Cluster";
DROP TABLE "Cluster";
ALTER TABLE "new_Cluster" RENAME TO "Cluster";
CREATE UNIQUE INDEX "Cluster_token_key" ON "Cluster"("token");
CREATE UNIQUE INDEX "Cluster_registrationId_key" ON "Cluster"("registrationId");
CREATE INDEX "Cluster_userId_idx" ON "Cluster"("userId");
CREATE INDEX "Cluster_status_idx" ON "Cluster"("status");
CREATE INDEX "Cluster_lastSeen_idx" ON "Cluster"("lastSeen");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
