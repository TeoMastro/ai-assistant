"use client";
import { SetStateAction, useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChatMessage } from "@ext/types";

export const ChatModel = (props: any) => {
	const initialized = useRef(false)
	const togetherApiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [prompt, setPrompt] = useState("");

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			const newMessages = props.messages.map((message: any) => ({
				prompt: message.prompt,
				completion: message.completion,
			}));
			setChatHistory((prevMessages) => [...prevMessages, ...newMessages]);
		}
	}, [props.messages]);

	const handleChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setPrompt(event.target.value);
	};

	useEffect(() => {
		const textareas = document.querySelectorAll('textarea[readOnly]');
        textareas.forEach(textarea => {
            if (textarea instanceof HTMLElement) {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight + 5}px`;
            }
        })
	}, [chatHistory]); // Adjust height whenever chatHistory changes

	const generateCompletion = async (e: { preventDefault: () => void }) => {
		if (prompt === "") {
			return;
		}

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
				async (response) => {
					console.log(response);
					const newMessage: ChatMessage = {
						prompt: prompt,
						completion: response.data.choices[0].message.content,
						llmSessionId: props.llmSessionId,
					};
					await uploadMessage(newMessage);
					setChatHistory([...chatHistory, newMessage]);
					setPrompt("");
				},
				(error) => {
					console.log(error);
				}
			);
	};

	const uploadMessage = async (message: ChatMessage) => {
		try {
			await fetch("/api/chat-message", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});
		} catch (error) {
			console.error("Uploading new message failed:", error);
		}
	};

	return (
		<>
			<div className="height-full-custom overflow-auto p-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
				{chatHistory.length > 0 && (
					<div className="p-4 bg-gray-100 dark:bg-gray-700">
						{chatHistory.map((message, index) => (
							<div
								key={index}
								className="mb-1 text-sm text-gray-600 dark:text-gray-400"
							>
								<strong>Prompt:</strong> {message.prompt}
								<textarea
                                    className="block p-2.5 w-full mt-1.5 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={message.completion}
                                    readOnly
									style={{ resize: 'none' }}
                                ></textarea>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="mt-3">
				<textarea
					className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Write your thoughts here..."
					value={prompt}
					onChange={handleChange}
				></textarea>
				<button
					type="button"
					onClick={generateCompletion}
					className="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>
					Send
				</button>
			</div>
		</>
	);
};
