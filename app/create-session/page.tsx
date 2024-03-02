import { createLlmSession } from "@ext/server-actions/llm-session";
import { LlmName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function CreateSession() {
	const handleSubmit = async (formData: FormData) => {
		"use server";
        const data = {
            name: formData.get('name') as string,
            modelName: formData.get('modelName') as LlmName,
        };
		const sessionCreated = await createLlmSession(data);
		if (sessionCreated) {
			revalidatePath("/sessions");
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
						Name
					</label>
					<input
						type="text"
						name="name"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div className="mb-5">
					<label
						htmlFor="modelName"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>
						Select a model
					</label>
					<select
						name="modelName"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="">Select a model...</option>
						<option value="llama2_chat">LLama2 Chat</option>
					</select>
				</div>
				<button
					className="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					type="submit"
				>
					Create
				</button>
			</form>
		</>
	);
}
