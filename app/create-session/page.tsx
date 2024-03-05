import SessionForm from "@ext/components/forms/session-form";

export default async function CreateSession() {
	return (
		<>
			<SessionForm isUpdate={false} />
		</>
	);
}
