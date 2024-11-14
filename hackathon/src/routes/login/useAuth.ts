import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import GetFetcher from "@/routes/getfetcher";

const useAuth = () => {
	const [loginUser, setLoginUser] = useState(null);
	const router = useRouter();
	const { data: userData } = GetFetcher("http://localhost:8080/user");

	useEffect(() => {
		if (userData) {
			setLoginUser(userData); // 取得したユーザーデータをセット
			Cookies.set("user", JSON.stringify(userData.user), { expires: 7 });
			router.push("/home");
		} else {
			setLoginUser(null); // ユーザーがいない場合はnullを設定
			Cookies.remove("user");
		}
	}, [userData, router]);


	return loginUser; // ここでloginUserを返す
};

export default useAuth;