import LlmSessionCard from "@ext/components/llm-session-card";
import { loadAllLlmSessions } from "@ext/server-actions/llm-session";

export default async function Sessions() {
	const llmSessions = await loadAllLlmSessions();

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
