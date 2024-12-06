"use client";

import { LoginForm } from "@/components/pages/login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fireAuth } from "@/features/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
	const router = useRouter();
	useEffect(() => {
        const auth = fireAuth;
        // ユーザーの認証状態を監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				// ログインしている場合はホーム画面に遷移
				router.push("/");
			}else
			{
				router.push("/home");
			}
		});
		return () => unsubscribe();
	}
	, [router]);
    return (
        <div>
            <LoginForm />
        </div>
    );
}
