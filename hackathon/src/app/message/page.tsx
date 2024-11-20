"use client";

import Sidebar from "@/components/pages/layout/components/sidebar";
import DirectMessage from "@/components/pages/message/page";

export default function Component() {
    return (
		<div className="flex min-h-screen bg-background">
			<Sidebar />
			<main className="flex-1 ml-80 mr-10 border-r border-l">
				<DirectMessage />
			</main>
		</div>
    );
}
