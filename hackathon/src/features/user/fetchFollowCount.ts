export const fetchFollows = async (token: string,userId:string) => {
	try {
		const followResponse = await fetch(
			`http://localhost:8000/follow/${userId}/following`,
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

export const fetchFollowers = async (token: string,userId:string) => {
	try {
		const followResponse = await fetch(
			`http://localhost:8000/follow/${userId}/follower`,
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