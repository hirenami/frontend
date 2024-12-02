export const updatePremium = async (token: string) => {
	try {
		const Response = await fetch(
			`https://backend-71857953091.us-central1.run.app/premium`,
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