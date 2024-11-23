export const purchase = async (token: string, listingid: number) => {
	try {
		const Response = await fetch(
			`http://localhost:8080/purchase`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(listingid),
			}
		);

		if (!Response.ok) {
			throw new Error("購入に失敗しました");
		}
	} catch (error) {
		console.error("購入に失敗しました:", error);
	}
};