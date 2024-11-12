import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.jsのルーティング
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { fetchUserData } from "@/features/user/fetchUserData";
import Cookies from "js-cookie";

const useAuth = () => {
    const [loginUser, setLoginUser] = useState(null); // 初期状態をnullにする
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            console.log("Auth state changed:", user); // ユーザー情報の状態を確認
            if (user) {
                const token = await user.getIdToken();
                const userData = await fetchUserData(token, "");
                
                if (userData) {
                    setLoginUser(userData); // 取得したユーザーデータをセット
                    Cookies.set("user", JSON.stringify(userData.user), { expires: 7 });
                    router.push("/home");
                } else {
                    console.error("ユーザーデータが無効です");
                }
            } else {
                setLoginUser(null); // ユーザーがいない場合はnullを設定
                Cookies.remove("user");
            }
        });

        return () => unsubscribe();
    }, [router]);

    return loginUser; // ここでloginUserを返す
};

export default useAuth;