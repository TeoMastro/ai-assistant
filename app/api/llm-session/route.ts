import { prisma } from "@ext/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
				status: 401,
			});
		}
        const userId = +session.user?.id;
		const { name, modelName } = await req.json();

		if (!name || !modelName) {
			return new Response(
				JSON.stringify({ error: "Missing name or model name" }),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}

		const llmSession = await prisma.llmSession.create({
			data: {
                userId,
				name,
				modelName,
			},
		});
		return NextResponse.json(llmSession);
	} catch (error) {
        console.log(error)
		return new Response(
			JSON.stringify({ error: "Failed to create session" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
