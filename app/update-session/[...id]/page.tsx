import SessionForm from "@ext/components/forms/session-form";
import { findLlmSessionById } from "@ext/server-actions/llm-session";

export default async function CreateSession({ params }: { params: { slug: string }}) {
    const session = await findLlmSessionById(+params.id);

	return (
		<>
			<SessionForm session={session} isUpdate={true}/>
		</>
	);
}
