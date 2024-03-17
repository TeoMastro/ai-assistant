"use client";

import { EmbeddingSchema } from "@ext/lib/client-validation-schemas";
import { errorToast, successToast } from "../toasts/display-toasts";

export default function EmbeddingForm({ allSessions }: any) {
	const handleSubmit = async (formData: FormData) => {
		const data = {
			content: formData.get("content") as string,
			llmSessionId: formData.get("llmSessionId") as string,
		};
        console.log(data)
		const result = EmbeddingSchema.safeParse(data);
		if (!result.success) {
			errorToast("Please check your input data");
			return;
		}

		try {
			const response = await fetch("/api/embedding-create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: data.content,
					llmSessionId: data.llmSessionId,
				}),
			});
			if (!response.ok) {
				return;
			}
			const newMessage = await response.json();

			if (newMessage) {
				successToast("Record created sucessfully");
			}
		} catch (error) {
			console.error("Uploading new embedding failed:", error);
		}
	};

	return (
		<>
			<form action={handleSubmit}>
				<div className="mb-5">
					<label
						htmlFor="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>
						Embedding content
					</label>
					<input
						type="text"
						name="content"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div className="mb-5">
					<label
						htmlFor="llmSessionId"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>
						LLM Session
					</label>
					<select
						name="llmSessionId"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						required
					>
						{allSessions.map((session: any) => (
							<option key={session.id} value={session.id}>
								{session.name} - {session.modelName}
							</option>
						))}
					</select>
				</div>
				<button
					className="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					type="submit"
				>
					Upload
				</button>
			</form>
		</>
	);
}
