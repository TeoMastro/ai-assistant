"use client";

import "../../app/globals.css";
import { Inter } from "next/font/google";

import Header from "../../components/layout/header";
import HeaderMobile from "../../components/layout/header-mobile";
import MarginWidthWrapper from "../../components/layout/margin-width-wrapper";
import PageWrapper from "../../components/layout/page-wrapper";
import SideNav from "../../components/layout/side-nav";
import { Providers } from "../../app/providers";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function ConditionalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const showBlankLayout = pathname === "/register" || pathname === "/login";
	
	if (showBlankLayout) {
		return (
			<html lang="en">
				<body className={`bg-white${inter.className}`}>
					<div className="flex">
						<main className="flex-1">
							<Providers>{children}</Providers>
							<Toaster
								closeButton
								richColors
								position="top-right"
							/>
						</main>
					</div>
				</body>
			</html>
		);
	}

	return (
		<html lang="en">
			<body className={`bg-white${inter.className}`}>
				<div className="flex">
					<SideNav />
					<main className="flex-1">
						<MarginWidthWrapper>
							<Header />
							<HeaderMobile />
							<PageWrapper>
								<Providers>{children}</Providers>
							</PageWrapper>
						</MarginWidthWrapper>
						<Toaster closeButton richColors position="top-right" />
					</main>
				</div>
			</body>
		</html>
	);
}
