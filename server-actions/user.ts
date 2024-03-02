"use server";
import { getServerSession } from "next-auth";
import { prisma } from "@ext/lib/prisma";

export const currentUser = async () => {
    const session = await getServerSession();
	const userEmail = session?.user?.email as string;
	const user = await prisma.user.findUnique({
		where: {
			email: userEmail,
		},
	});
    return user;
}