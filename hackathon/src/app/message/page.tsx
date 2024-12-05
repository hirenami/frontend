"use client";

import MobileNavigation from "@/components/pages/layout/components/mobilesidebar";
import Sidebar from "@/components/pages/layout/components/sidebar";
import DirectMessage from "@/components/pages/message";

export default function Component() {
    return (
		<>
		<div className="flex min-h-screen bg-background">
			<Sidebar />
			<main className="flex-1 ml-0 md:ml-80 mr-0 md:mr-10 border-r border-l">
				<DirectMessage />
			</main>
		</div>
		<MobileNavigation />
		</>
    );
}
