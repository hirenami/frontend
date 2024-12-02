export const fetchReplyData = async (token: string, tweetId: number) => {
	try {
		const tweetsResponse = await fetch(
			`https://backend-71857953091.us-central1.run.app/reply/${tweetId}`,
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
		console.log("Replies Data:", tweetsData);
		return tweetsData;
	} catch (error) {
		console.error("リプライデータの取得に失敗しました:", error);
	}
};