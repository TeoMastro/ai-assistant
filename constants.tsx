import { Icon } from "@iconify/react";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
	{
		title: "Home",
		path: "/",
		icon: <Icon icon="lucide:home" width="24" height="24" />,
	},
	{
		title: "Sessions",
		icon: <Icon icon="lucide:message-square-more" width="24" height="24" />,
		path: "/sessions",
	},
	{
		title: "Create",
		path: "/create-session",
		icon: <Icon icon="lucide:square-plus" width="24" height="24" />,
		submenu: true,
		subMenuItems: [
			{ title: "Embedding", path: "/create-embedding" },
			{ title: "Llm session", path: "/create-session" },
		],
	},
	// {
	// 	title: "Settings",
	// 	path: "/settings",
	// 	icon: <Icon icon="lucide:settings" width="24" height="24" />,
	// 	submenu: true,
	// 	subMenuItems: [
	// 		{ title: "Account", path: "/settings/account" },
	// 		{ title: "Privacy", path: "/settings/privacy" },
	// 	],
	// },
	// {
	// 	title: "Help",
	// 	path: "/help",
	// 	icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
	// },
];
