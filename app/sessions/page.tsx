import { getServerSession } from "next-auth";
import { prisma } from "@ext/lib/prisma";
import LlmSessionCard from "@ext/components/llm-session-card";

export default async function Sessions() {
	const session = await getServerSession();
	const userEmail = session?.user?.email as string;
	const userId = await prisma.user.findUnique({
		where: {
			email: userEmail,
		},
	});
	const llmSessions = await prisma.llmSession.findMany({
		where: {
			userId: userId?.id,
		},
	});
	return (
		<>
			<div className="grid sm:grid-cols-1 min-[1100px]:grid-cols-2 min-[1500px]:grid-cols-3 gap-1">
				{llmSessions.map((session) => (
					<LlmSessionCard key={session.id} {...session} />
				))}
			</div>
		</>
	);
}
