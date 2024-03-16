import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import { prisma } from "@ext/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
				status: 401,
			});
		}
		const { relevantContent, llmSessionId, prompt } = await req.json();

		let createdPrompt = "";
		if (relevantContent) {
			createdPrompt = `[INST] Context: ${relevantContent}. User Prompt: ${prompt} [/INST]`;
		} else {
			createdPrompt = `[INST] ${prompt} [/INST]`;
		}
		let messageToReturn;
		const result = await axios
			.post(
				"https://api.together.xyz/v1/chat/completions",
				{
					model: "meta-llama/Llama-2-70b-chat-hf",
					max_tokens: 512,
					prompt: createdPrompt,
					temperature: 0.7,
					top_p: 0.7,
					top_k: 50,
					repetition_penalty: 1,
					stream_tokens: false,
					stop: ["[/INST]", "</s>"],
					repetitive_penalty: 1,
				},
				{
					headers: {
						Authorization:
							"Bearer " + process.env.NEXTPUBLIC_TOGETHER_API_KEY,
					},
				}
			)
			.then(
				async (response) => {
					await prisma.chatMessage.create({
						data: {
							prompt,
							completion:
								response.data.choices[0].message.content,
							llmSessionId,
						},
					});
					messageToReturn = {
						prompt,
						completion: response.data.choices[0].message.content,
						llmSessionId,
					};
				},
				(error) => {
					console.log(error);
				}
			);

		revalidatePath(`/chat/${llmSessionId}`);
		return NextResponse.json(messageToReturn);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to create chat completion" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
