import { LlmName } from "@prisma/client";
import Link from "next/link";

export default function LlmSessionCard(session: { id: number; userId: number; name: string; modelName: LlmName; createdAt: Date;}) {
	return (
		<>
			<div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
				<div className="p-6">
					<h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {session.name} - {session.modelName}
					</h5>
				</div>
				<div className="p-6 pt-0">
					<Link
						className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
						type="button"
						href={`/chat/${session.id}`}
					>
						Open
					</Link>
				</div>
			</div>
		</>
	);
}