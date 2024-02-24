/*
  Warnings:

  - You are about to drop the column `createdAt` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `llmSessionId` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `llm_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `llm_sessions` table. All the data in the column will be lost.
  - Added the required column `llm_session_id` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `llm_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_llmSessionId_fkey";

-- DropForeignKey
ALTER TABLE "llm_sessions" DROP CONSTRAINT "llm_sessions_userId_fkey";

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "createdAt",
DROP COLUMN "llmSessionId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "llm_session_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "llm_sessions" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "llm_sessions" ADD CONSTRAINT "llm_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_llm_session_id_fkey" FOREIGN KEY ("llm_session_id") REFERENCES "llm_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
