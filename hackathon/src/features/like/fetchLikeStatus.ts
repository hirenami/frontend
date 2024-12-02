export const fetchLikeStatus = async (token: string, tweetid: number) => {
	try {
		const likeResponse = await fetch(
			`https://backend-71857953091.us-central1.run.app/like/${tweetid}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!likeResponse.ok) {
			throw new Error("いいね情報の取得に失敗しました");
		}

		const likeStatus = await likeResponse.json();
		console.log("Like Status:", likeStatus);
		return likeStatus;
	} catch (error) {
		console.error("いいねデータの取得に失敗しました:", error);
	}
};