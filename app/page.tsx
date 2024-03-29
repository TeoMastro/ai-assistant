import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./user";
import { LoginButton, LogoutButton } from "@ext/components/auth";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<>
			<div className="">
				<LoginButton />
				<LogoutButton />
				<h2>Server Session</h2>
				<pre>{JSON.stringify(session)}</pre>
				<h2>Client Call</h2>
				<User />
			</div>
		</>
	);
}
