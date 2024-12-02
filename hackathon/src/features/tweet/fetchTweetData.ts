export const fetchTweetsData = async (token: string, userId: string) => {
	try {
		const tweetsResponse = await fetch(
			`https://backend-71857953091.us-central1.run.app/tweet/${userId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!tweetsResponse.ok) {
			throw new Error("ツイートデータの取得に失敗しました");
		}

		const tweetsData = await tweetsResponse.json();
		console.log("Tweets Data:", tweetsData);
		return tweetsData;
	} catch (error) {
		console.error("ツイートデータの取得に失敗しました:", error);
	}
};