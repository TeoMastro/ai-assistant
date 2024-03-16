import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
				status: 401,
			});
		}
		const { promptAsEmbedding, llmSessionId } = await req.json();

		const supabase = createClient(process.env.NEXTPUBLIC_SUPABASE_URL, process.env.NEXTPUBLIC_SUPABASE_KEY);

		const { data: documents } = await supabase.rpc("match_documents", {
			query_embedding: promptAsEmbedding,
			match_threshold: 0.4, // Choose an appropriate threshold for your data
			match_count: 10, // Choose the number of matches
			input_llmsessionid: llmSessionId,
		});

		return documents;
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
