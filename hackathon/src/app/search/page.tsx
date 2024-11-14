import { useState, useEffect } from "react";
import useSWR from "swr";
import { fireAuth } from "@/features/firebase/auth";

// fetcher関数
export const fetcher = async (url: string, token: string) => {
  return fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

const useAuthFetcher = (url: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setToken(token);
        } catch (error) {
          console.error("トークン取得エラー:", error);
        }
      } else {
        setToken(null);
      }
      setIsLoading(false);
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  const { data, error } = useSWR(
    token ? url : null, // トークンが取得できた場合のみURLを渡す
    (url) => fetcher(url, token!), // トークンがある場合のみ実行
    {
      revalidateOnFocus: false, // 不要な再試行を防ぐ
      revalidateOnReconnect: false, // 再接続時の再試行を防ぐ
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useAuthFetcher;
