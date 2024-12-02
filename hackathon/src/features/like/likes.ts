import { Tweet } from "@/types/index";

export const createLike = async (tweet: Tweet, token: string) => {
	try {
		const response = await fetch(`https://backend-71857953091.us-central1.run.app/like/${tweet.tweetid}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("いいねに失敗しました");
		}
		console.log("いいね成功");
	} catch (error) {
		console.error("いいねエラー:", error);
	}
};

export const deleteLike = async (tweet: Tweet, token: string) => {
	try {
		const response = await fetch(`https://backend-71857953091.us-central1.run.app/like/${tweet.tweetid}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("いいね解除に失敗しました");
		}
		console.log("いいね解除成功");
	} catch (error) {
		console.error("いいね解除エラー:", error);
	}
}
