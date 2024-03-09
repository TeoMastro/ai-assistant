import { prisma } from "@ext/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
				status: 401,
			});
		}
		const { prompt, completion, llmSessionId } = await req.json();

		if (!prompt || !completion || !llmSessionId) {
			return new Response(
				JSON.stringify({ error: "Missing prompt or completion or session id" }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}

		const message = await prisma.chatMessage.create({
			data: {
				prompt,
				completion,
				llmSessionId,
			},
		});
		revalidatePath(`/chat/${llmSessionId}`);
		return NextResponse.json(message);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to create message" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
