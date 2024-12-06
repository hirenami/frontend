"use client";

import SearchLayout from "@/components/pages/layout/searchlayout";
import SearchPage from "@/components/pages/search";
import { Suspense } from "react";
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
        <Suspense fallback={<div>Loading...</div>}>
            <SearchLayout>
                <SearchPage />
            </SearchLayout>
        </Suspense>
    );
}
