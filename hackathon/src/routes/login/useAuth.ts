import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GetFetcher from "@/routes/getfetcher";

const useAuth = () => {
	const [loginUser, setLoginUser] = useState(null);
	const router = useRouter();
	const { data: userData } = GetFetcher("https://backend-71857953091.us-central1.run.app/user");

	useEffect(() => {
		if (userData) {
			setLoginUser(userData); // 取得したユーザーデータをセット
			router.push("/home");
		} else {
			setLoginUser(null); // ユーザーがいない場合はnullを設定
		}
	}, [userData, router]);


	return loginUser; // ここでloginUserを返す
};

export default useAuth;