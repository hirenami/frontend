export const handleFollow = async (userid: string, token: string | null, isFollowing: boolean, followerCount: number, setIsFollowing: (state: boolean) => void, setFollowerCount: (state: number) => void) => {
	try {
		const response = await fetch(
			`http://localhost:8080/follow/${userid}`,
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