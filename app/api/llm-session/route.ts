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

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensuring the user is authenticated
        if (!session) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }
        const userId = +session.user?.id;
        
        // Assuming the session ID is sent as a query parameter or part of the URL
        // You might need to adjust how you extract the sessionId based on your API design
		const { sessionId } = await req.json();

        if (!sessionId) {
            return new Response(
                JSON.stringify({ error: "Missing session ID" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
		const deleteAllMessagesResponse = await prisma.chatMessage.deleteMany({
			where: {
				llmSessionId: +sessionId,
			},
		});
		
        const deleteResponse = await prisma.llmSession.delete({
            where: {
                id: +sessionId,
                userId: userId,
            },
        });
		console.log(deleteResponse)

        return NextResponse.json({deleteResponse, deleteAllMessagesResponse});
    } catch (error) {
		console.log(error)
        return new Response(
            JSON.stringify({ error: "Failed to delete session" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
