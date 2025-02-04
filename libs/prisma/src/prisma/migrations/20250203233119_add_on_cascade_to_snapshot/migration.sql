-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_clusterId_fkey";

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
