import { ChatModel } from "@ext/components/chat-model";
import { prisma } from "@ext/lib/prisma";

export default async function Chat({ params }: { params: { slug: string }}) {
	const sessionMessages = await prisma.chatMessage.findMany({
		where: {
			llmSessionId: +params.id,
		},
	});

	return (
		<>
			<ChatModel messages={sessionMessages} llmSessionId={+params.id}/>
		</>
	);
}
