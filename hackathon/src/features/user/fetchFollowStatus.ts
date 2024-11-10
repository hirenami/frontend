export const fetchFollowStatus = async (token: string, userId: string) => {
	try {
		const followResponse = await fetch(
			`http://localhost:8080/follow/${userId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!followResponse.ok) {
			throw new Error("フォロー状態の取得に失敗しました");
		}

		const followData = await followResponse.json();
		console.log("Follow Data:", followData);
		return followData;
	} catch (error) {
		console.error("フォロー状態の取得に失敗しました:", error);
	}
};