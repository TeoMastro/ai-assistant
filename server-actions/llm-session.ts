"use server";

import { prisma } from "@ext/lib/prisma";
import { LlmName, LlmSession } from "@prisma/client";
import { currentUser } from "./user";
import { revalidatePath } from "next/cache";

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
        revalidatePath("/sessions");
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
            orderBy: {
                updatedAt: "desc",
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
        revalidatePath("/sessions");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const updateLlmSession = async (sessionUpdate: {
    id: number;
    userId?: number;
    name?: string;
    modelName?: LlmName;
}): Promise<boolean> => {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not found or mismatch");
        }
        await prisma.llmSession.update({
            where: {
                id: sessionUpdate.id,
            },
            data: {
                ...(sessionUpdate.name && { name: sessionUpdate.name }),
                ...(sessionUpdate.modelName && {
                    modelName: sessionUpdate.modelName,
                }),
            },
        });
        revalidatePath("/sessions");
        return true;
    } catch (error) {
        console.error("Update failed: ", error);
        return false;
    }
};

export const findLlmSessionById = async (
    sessionId: number
): Promise<LlmSession | null> => {
    try {
        const llmSession = await prisma.llmSession.findUnique({
            where: {
                id: sessionId,
            },
        });
        return llmSession;
    } catch (error) {
        console.error("Error finding LLM session by ID: ", error);
        return null;
    }
};
