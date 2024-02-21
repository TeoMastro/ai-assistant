"use client";
import { SetStateAction, useState } from "react";
import axios from "axios";

export const Llama270bButton = () => {
	const togetherApiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
	const [completion, setCompletion] = useState("");
	const [prompt, setPrompt] = useState("");

	const handleChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setPrompt(event.target.value);
	};

	const generateCompletion = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		axios
			.post(
				"https://api.together.xyz/v1/chat/completions",
				{
					model: "meta-llama/Llama-2-70b-chat-hf",
					max_tokens: 512,
					prompt: `[INST] ${prompt} [/INST]`,
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
						Authorization: "Bearer " + togetherApiKey,
					},
				}
			)
			.then(
				(response) => {
					setCompletion(response.data.choices[0].message.content);
				},
				(error) => {
					console.log(error);
				}
			);
	};

	return (
		<>
			{/* Conditionally render this div if completion is not empty */}
			{completion && (
				<div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
					<p className="text-sm text-gray-900 dark:text-white">
						Completion:
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{completion}
					</p>
				</div>
			)}
			<div>
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					User Prompt
				</label>
				<textarea
					id="message"
					className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Write your thoughts here..."
					value={prompt}
					onChange={handleChange}
				></textarea>
			</div>

			<button
				type="button"
				onClick={generateCompletion}
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
			>
				Default
			</button>
		</>
	);
};