// UserDataを取得する関数
export const fetchUserData = async (token: string,userId:string) => {
	// userIdが空の場合は特定のエンドポイントを使用
    const endpoint = userId ? `http://localhost:8000/user/${userId}` : `http://localhost:8000/user`;

	try {
		const userResponse = await fetch(
			endpoint,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!userResponse.ok) {
			throw new Error("ユーザー情報の取得に失敗しました");
		}

		const userData = await userResponse.json();
		
		return userData;

	} catch (error) {
		console.error("ユーザーデータの取得に失敗しました:", error);
	}
};