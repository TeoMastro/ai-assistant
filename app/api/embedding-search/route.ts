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

		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseKey = process.env.SUPABASE_KEY;
		const supabase = createClient(supabaseUrl, supabaseKey);

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
					Authorization: "Bearer " + process.env.TOGETHER_API_KEY,
				},
			}
		);

		const { data: documents } = await supabase.rpc("match_documents", {
			query_embedding: embeddingResponse.data.data[0].embedding,
			match_threshold: 0.4, // Choose an appropriate threshold for your data
			match_count: 10, // Choose the number of matches
			input_llmsessionid: llmSessionId,
		});

		return NextResponse.json(documents);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to search embedding" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}
