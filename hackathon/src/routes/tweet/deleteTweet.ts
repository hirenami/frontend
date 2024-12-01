export const deleteTweet = async (tweetid:number, token: string) => {
  try {
	await fetch(`http://localhost:8080/tweet/${tweetid}`, {
	  method: "DELETE",
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	});
  } catch (error) {
	console.error("ツイートの削除に失敗しました:", error);
  }
}