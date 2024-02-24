/*
  Warnings:

  - Added the required column `model_name` to the `llm_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LlmName" AS ENUM ('llama2_chat', 'codellama', 'mixstral');

-- AlterTable
ALTER TABLE "llm_sessions" ADD COLUMN     "model_name" "LlmName" NOT NULL;
