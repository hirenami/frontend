export const updatePremium = async (token: string) => {
	try {
		const Response = await fetch(
			`http://localhost:8080/premium`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!Response.ok) {
			throw new Error("プレミアムの更新に失敗しました");
		}
	} catch (error) {
		console.error("プレミアムの更新に失敗しました:", error);
	}
};