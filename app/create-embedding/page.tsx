import EmbeddingForm from "@ext/components/forms/embedding-form";
import { findAllSessionsOfCurrentUser } from "@ext/server-actions/llm-session";

export default async function Embedding() {
    const llmSessionsOfUser = await findAllSessionsOfCurrentUser();
	return (
		<>
			<EmbeddingForm allSessions={llmSessionsOfUser}/>
		</>
	);
}
