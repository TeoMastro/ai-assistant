// I might find another/better way to compare the embeddings (?)
export function cosineSimilarity(
	vecA: Float32Array | number[],
	vecB: Float32Array | number[]
): number {
	if (vecA.length !== vecB.length) {
		throw new Error("Vectors have different dimensions");
	}

	let dotProduct = 0.0;
	let normA = 0.0;
	let normB = 0.0;

	for (let i = 0; i < vecA.length; i++) {
		dotProduct += vecA[i] * vecB[i];
		normA += vecA[i] ** 2;
		normB += vecB[i] ** 2;
	}

	normA = Math.sqrt(normA);
	normB = Math.sqrt(normB);

	if (normA === 0 || normB === 0) {
		throw new Error("One of the vectors is zero");
	}

	return dotProduct / (normA * normB);
}

export async function findRelevantContent(
	inputEmbedding: Float32Array,
	items: any // this will be changed as these items will come from the vector db.
): Promise<string> {
	let highestSimilarity = -1;
	let mostRelevantContent = "";

	for (const item of items) {
		const similarity = cosineSimilarity(
			inputEmbedding,
			new Float32Array(item.embedding)
		);
		if (similarity > highestSimilarity) {
			highestSimilarity = similarity;
			mostRelevantContent = item.content;
		}
	}

	return mostRelevantContent;
}


/**
 * Example usage of generating an embedding and comparing it to our db. This will be done in a frontend probably with an api call.
 */
// const embeddingResponse = await axios.post(
//     "https://api.together.xyz/v1/embeddings",
//     {
//         model: "BAAI/bge-large-en-v1.5",
//         input: prompt,
//     },
//     {
//         headers: {
//             accept: "application/json",
//             "content-type": "application/json",
//             Authorization: "Bearer " + togetherApiKey,
//         },
//     }
// );
// const inputEmbedding = new Float32Array(
//     embeddingResponse.data.data[0].embedding
// );
// const relevantContent = await findRelevantContent(inputEmbedding); // This will give me the text that is more relevant to the input prompt