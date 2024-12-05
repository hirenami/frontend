export const postevents = async (token: string | null, listingid: number) => {
	try {
		const Response = await fetch(
			`https://backend-71857953091.us-central1.run.app/api/write-event/${listingid}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!Response.ok) {
			throw new Error("送信に失敗しました");
		}
	} catch (error) {
		console.error("送信に失敗しました:", error);
	}
};