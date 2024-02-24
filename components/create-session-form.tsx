"use client";
import { useState } from "react";

export default function CreateSessionForm() {
	const [formData, setFormData] = useState({
		name: "",
		modelName: "",
	});

	const handleChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const createSession = async (e: any) => {
		e.preventDefault();
		try {
			await fetch("/api/llm-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<>
			<form onSubmit={createSession}>
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
						value={formData.name}
						onChange={handleChange}
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
						value={formData.modelName}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="">Select a model...</option>
						<option value="llama2_chat">LLama2 Chat</option>
					</select>
				</div>
				<button
					className="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					type="submit"
                    disabled={!formData.name || !formData.modelName}
				>
					Create
				</button>
			</form>
		</>
	);
}
