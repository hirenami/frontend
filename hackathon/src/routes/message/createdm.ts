export const CreateDM = async (token: string | null, receiverid: string | undefined, content: string, media_url: string) => {
	try {
		const Response = await fetch(
			`https://backend-71857953091.us-central1.run.app/dm`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ receiverid, content, media_url }),
			}
		);

		if (!Response.ok) {
			throw new Error("DMに失敗しました");
		}
	} catch (error) {
		console.error("DMに失敗しました:", error);
	}
};