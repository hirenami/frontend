import { fireAuth } from "@/features/firebase/auth";

export const fetchOneTweet = async (tweetid:number) => {
	const auth = fireAuth;
	try {
		const token = await auth.currentUser?.getIdToken();
		const tweetsResponse = await fetch(
			`http://localhost:8000/tweet/${tweetid}/tweetid`,
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
		console.log("Tweets ONE Data:", tweetsData);
		return tweetsData;
	} catch (error) {
		console.error("ツイートデータの取得に失敗しました:", error);
	}
};