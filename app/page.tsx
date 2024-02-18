import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./user";
import { LoginButton, LogoutButton } from "@ext/components/auth";
import Link from "next/link";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main>
			<Link href="/llama2-70b" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Llama 2 (70b)</Link>
			<LoginButton />
			<LogoutButton />
			<h2>Server Session</h2>
			<pre>{JSON.stringify(session)}</pre>
			<h2>Client Call</h2>
			<User />
		</main>
	);
}
