export const fetchRetweetStatus = async (token: string, tweetid: number) => {
	try {
		const retweetResponse = await fetch(
			`http://localhost:8080/retweet/${tweetid}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!retweetResponse.ok) {
			throw new Error("リツイート情報の取得に失敗しました");
		}

		const retweetStatus = await retweetResponse.json();
		console.log("retweet Status:", retweetStatus);
		return retweetStatus;
	} catch (error) {
		console.error("リツイートデータの取得に失敗しました:", error);
	}
};