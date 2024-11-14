import { useState, useEffect } from "react";
import useSWR from "swr";
import { fireAuth } from "@/features/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const GetFetcher = (url: string) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // fetcher関数
    const fetcher = async (url: string, token: string) => {
        return fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        // 認証状態の監視
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    setToken(token); // トークンを状態に保存
                } catch (error) {
                    console.error("トークン取得エラー:", error);
                }
            } else {
                console.error("ユーザーがログインしていません");
                setToken(null); // ユーザーがいない場合、トークンをリセット
            }
            setIsLoading(false); // 認証情報の取得が完了したら、ローディングを解除
        });

        // クリーンアップ: コンポーネントがアンマウントされた時にリスナーを解除
        return () => unsubscribe();
    }, []); // 最初のレンダリング時に1回だけ実行

    // tokenが設定されてからSWRを実行
    const { data, error } = useSWR(
        token ? url : null, // tokenが取得できたらURLでフェッチ
        (url) => fetcher(url, token!), // tokenが必ずある前提で
        {
            revalidateOnFocus: false, // 不要な再試行を防ぐ
            revalidateOnReconnect: false, // 再接続時の再試行を防ぐ
        }
    );

    return {
        data,
        error,
        isLoading,
        token, // 取得したトークンを返却
    };
};

export default GetFetcher;