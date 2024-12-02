export const handleFollow = async (userid: string, token: string | null, isFollowing: boolean, followerCount: number, setIsFollowing: (state: boolean) => void, setFollowerCount: (state: number) => void) => {
	try {
		const response = await fetch(
			`https://backend-71857953091.us-central1.run.app/follow/${userid}`,
			{
				method: isFollowing ? "DELETE" : "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.ok) {
			setIsFollowing(!isFollowing);
			setFollowerCount(
				isFollowing ? followerCount - 1 : followerCount + 1
			);
		} else {
			throw new Error("フォロー操作に失敗しました");
		}
	} catch (error) {
		console.error("フォロー操作中にエラーが発生しました:", error);
	}
};