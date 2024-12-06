"use client";

import MobileNavigation from "@/components/pages/layout/components/mobilesidebar";
import Sidebar from "@/components/pages/layout/components/sidebar";
import DirectMessage from "@/components/pages/message";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fireAuth } from "@/features/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


export default function Component() {
	const router = useRouter();
	useEffect(() => {
        const auth = fireAuth;
        // ユーザーの認証状態を監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				// ログインしている場合はホーム画面に遷移
				router.push("/");
			}
		});
		return () => unsubscribe();
	}
	, [router]);

    return (
		<div className="flex min-h-screen bg-background">
			<Sidebar />
			<main className="flex-1 ml-0 md:ml-80 mr-0 md:mr-10 border-r border-l">
				<DirectMessage />
			</main>
			<MobileNavigation />
		</div>
    );
}
