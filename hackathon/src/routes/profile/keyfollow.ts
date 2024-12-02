export const handlekeyFollow = async (userid: string, token: string | null, isRequest: boolean, setIsRequest: (state: boolean) => void) => {
	try {
		const response = await fetch(
			`https://backend-71857953091.us-central1.run.app/keyfollow/${userid}`,
			{
				method: isRequest ? "DELETE" : "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.ok) {
			setIsRequest(!isRequest);
		} else {
			throw new Error("フォロー操作に失敗しました");
		}
	} catch (error) {
		console.error("フォロー操作中にエラーが発生しました:", error);
	}
};