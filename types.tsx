export type SideNavItem = {
	title: string;
	path?: string;
	icon?: JSX.Element;
	submenu?: boolean;
	subMenuItems?: SideNavItem[];
};

export interface ChatMessage {
	prompt: string;
	completion: string;
}
