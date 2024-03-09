import ConditionalLayout from "@ext/components/layout/conditional-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ai assistant",
	description: "Using LLMs to leverage ai capabilities in a chatting environment.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (<ConditionalLayout children={children} />)
}
