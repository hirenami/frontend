"use client"

import Layout from "@/components/pages/layout/layout"
import FollowPage from "@/components/pages/follow/index"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { fireAuth } from "@/features/firebase/auth"
import { onAuthStateChanged } from "firebase/auth"

export default function Component () {
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
		<Layout>
			<FollowPage/>
		</Layout>
	)
}