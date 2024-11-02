import {Tweet} from "@/types/index";

export const createRetweet = async (tweet :Tweet,token:string) => {
	try {
		const response = await fetch(`http://localhost:8000/retweet/${tweet.tweetid}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("に失敗しました");
		}
		console.log("リツイート成功");
	} catch (error) {
		console.error("リツイートエラー:", error);
	}
};

export const deleteRetweet = async (tweet :Tweet,token:string) => {
	try {
		const response = await fetch(`http://localhost:8000/retweet/${tweet.tweetid}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("リツイート解除に失敗しました");
		}
		console.log("リツイート解除成功");
	} catch (error) {
		console.error("リツイート解除エラー:", error);
	}
}