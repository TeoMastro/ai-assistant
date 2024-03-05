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
    ])
});
