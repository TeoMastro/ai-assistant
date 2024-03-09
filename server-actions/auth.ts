"use server";

import { prisma } from "@ext/lib/prisma";
import { hash } from "bcrypt";

export const register = async (user: {email: string, password: string}): Promise<boolean> => {
    try {
        const exists = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
        console.log(exists)
        if (exists) {
            return false;
        }
        const u = await prisma.user.create({
			data: {
				email: user.email,
				password: await hash(user.password, 12),
			},
		});
        console.log(u)
        return true;
    } catch (error) {
        console.error("Transaction failed: ", error);
        return false;
    }
};

