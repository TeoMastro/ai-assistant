"use server";

import { prisma } from "@ext/lib/prisma";
import { LlmName } from "@prisma/client";
import { currentUser } from "./user";

export const deleteLlmSession = async (session: {
	id: number;
	userId: number;
	name: string;
	modelName: LlmName;
	createdAt: Date;
}): Promise<boolean> => {
	try {
		await prisma.$transaction([
			prisma.chatMessage.deleteMany({
				where: {
					llmSessionId: session.id,
				},
			}),
			prisma.llmSession.delete({
				where: {
					id: session.id,
					userId: session.userId,
				},
			}),
		]);
		return true;
	} catch (error) {
		console.error("Transaction failed: ", error);
		return false;
	}
};

export const loadAllLlmSessions = async () => {
	try {
		const user = await currentUser();
		if (!user) {
			throw new Error("User not found");
		}
		const llmSessions = await prisma.llmSession.findMany({
			where: {
				userId: user?.id,
			},
		});
		return llmSessions;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const createLlmSession = async (formData: {
	name: string;
	modelName: LlmName;
}) => {
	try {
		const user = await currentUser();
		if (!user) {
			throw new Error("User not found");
		}
		await prisma.llmSession.create({
			data: {
				userId: user.id,
				name: formData.name,
				modelName: formData.modelName,
			},
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
