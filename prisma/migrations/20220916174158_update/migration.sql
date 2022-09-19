/*
  Warnings:

  - You are about to drop the column `bannerurl` on the `game` table. All the data in the column will be lost.
  - Added the required column `bannerUrl` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL
);
INSERT INTO "new_game" ("id", "title") SELECT "id", "title" FROM "game";
DROP TABLE "game";
ALTER TABLE "new_game" RENAME TO "game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
