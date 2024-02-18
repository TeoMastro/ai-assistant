"use client";
import { useState } from "react";
import axios from "axios";

export const Llama270bButton = () => {
	const togetherApiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;

	const scrapeResultText = (textResByModel: string) => {
		// Split the string into individual lines
		const lines = textResByModel.split("\n");

		// Filter out lines that don't start with "data: " and the final "data: [DONE]"
		const jsonLines = lines.filter(
			(line: string) =>
				line.startsWith("data: ") && !line.includes("[DONE]")
		);

		// Parse each line as JSON
		const jsonObjects = jsonLines.map((line: string) => {
			// Remove the "data: " prefix before parsing
			const jsonString = line.substring(6);
			return JSON.parse(jsonString);
		});

		// Now jsonObjects is an array of JSON objects you can work with
		console.log(jsonObjects);

		// Accessing generated_text from the last object assuming it contains the full text
		const lastObjectGeneratedText =
			jsonObjects[jsonObjects.length - 1].generated_text;
		console.log(lastObjectGeneratedText);
	};

	const generateAnswer = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		axios
			.post(
				"https://api.together.xyz/v1/completions",
				{
					model: "meta-llama/Llama-2-70b-hf",
					max_tokens: 512,
					prompt: "Tell me something about the world",
					temperature: 0.7,
					top_p: 0.7,
					top_k: 50,
					repetition_penalty: 1,
					stream_tokens: true,
					stop: ["</s>"],
				},
				{
					headers: {
						Authorization: "Bearer " + togetherApiKey,
					},
				}
			)
			.then(
				(response: any) => {
					const text = response.data;
                    scrapeResultText(text);
				},
				(error: any) => {
					console.log(error);
				}
			);
	};
	return (
		<>
			<button
				type="button"
				onClick={generateAnswer}
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
			>
				Default
			</button>
		</>
	);
};
