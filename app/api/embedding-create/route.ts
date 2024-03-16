import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
				status: 401,
			});
		}
		const { prompt, llmSessionId } = await req.json();

		const supabase = createClient(process.env.NEXTSUPABASE_URL, process.env.NEXTSUPABASE_KEY);

		const embeddingResponse = await axios.post(
			"https://api.together.xyz/v1/embeddings",
			{
				model: "BAAI/bge-large-en-v1.5",
				input: prompt,
			},
			{
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					Authorization: "Bearer " + process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
				},
			}
		);

		await supabase.from("documents").insert({
			content: prompt,
			embedding: embeddingResponse.data.data[0].embedding,
			llmsessionid: llmSessionId,
		});

		return true;
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to create and save embedding" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
