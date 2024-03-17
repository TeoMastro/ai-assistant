import { LlmName } from "@prisma/client";
import { z } from "zod";

export const LlmSessionSchema = z.object({
	id: z.number().optional(),
	name: z
		.string()
		.trim()
		.min(1, {
			message: "Name is required.",
		})
		.max(64, {
			message: "Name must be at most 64 characters long.",
		}),
	modelName: z.enum([
		LlmName.codellama,
		LlmName.llama2_chat,
		LlmName.mixstral,
	]),
});

export const AuthSchema = z.object({
	email: z
		.string()
		.trim()
		.email({ message: "Invalid email address." })
		.min(1, { message: "Email is required." })
		.max(64, { message: "Email must be at most 64 characters long." }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long." })
		.max(128, { message: "Password must be at most 128 characters long." }),
});

export const EmbeddingSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, {
			message: "Embedding name is required.",
		})
		.max(256, {
			message: "Embedding name must be at most 256 characters long.",
		}),
	llmSessionId: z.string(), // passed as a string from the select2
});
