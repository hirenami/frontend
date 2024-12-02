export const deleteTweet = async (tweetid: number, token: string) => {
	try {
		await fetch(`https://backend-71857953091.us-central1.run.app/tweet/${tweetid}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.error("ツイートの削除に失敗しました:", error);
	}
}