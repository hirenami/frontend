export const GetDMs = async (token: string | null, receiverid : string) => {
	try {
		const Response = await fetch(
			`http://localhost:8080/dm/${receiverid}/handle`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!Response.ok) {
			throw new Error("DMに失敗しました");
		}

		const response = await Response.json();
		return response;

	} catch (error) {
		console.error("DMに失敗しました:", error);
	}
};