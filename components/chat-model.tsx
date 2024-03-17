"use client";
import { SetStateAction, useEffect, useState, useRef } from "react";
import { ChatMessage } from "@ext/types";

export const ChatModel = (props: any) => {
	const initialized = useRef(false);
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [prompt, setPrompt] = useState("");
	const [searchInEmbeddings, setSearchInEmbeddings] = useState(false);
	const [documents, setDocuments] = useState([]);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
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
		const textareas = document.querySelectorAll("textarea[readOnly]");
		textareas.forEach((textarea) => {
			if (textarea instanceof HTMLElement) {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight + 5}px`;
			}
		});
	}, [chatHistory]); // Adjust height whenever chatHistory changes

	const handleCheckboxChange = (event: { target: { checked: boolean } }) => {
		setSearchInEmbeddings(event.target.checked);
	};

	const generateCompletion = async (e: { preventDefault: () => void }) => {
		if (prompt === "") {
			return;
		}
		e.preventDefault();

		if (searchInEmbeddings) {
			const response = await fetch("/api/embedding-search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: prompt,
					llmSessionId: props.llmSessionId,
				}),
			});
			if (!response.ok) {
				return;
			}
			const docs = await response.json();
			setDocuments(docs);
		}

		try {
			const response = await fetch("/api/llama-chat-70b-completion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					documents: searchInEmbeddings ? documents : null,
					llmSessionId: props.llmSessionId,
					prompt: prompt,
				}),
			});
			if (!response.ok) {
				return;
			}
			const newMessage = await response.json();
			setChatHistory([...chatHistory, newMessage]);
			setPrompt("");
			setDocuments([]);
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
									style={{ resize: "none" }}
								></textarea>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="mb-1 ml-1">
				<label className="inline-flex items-center">
					<input
						type="checkbox"
						className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						checked={searchInEmbeddings}
						onChange={handleCheckboxChange}
					/>
					<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
						Search for context in embeddings of this session
					</span>
				</label>
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
