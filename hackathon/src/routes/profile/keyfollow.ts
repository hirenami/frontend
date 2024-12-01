export const handlekeyFollow = async (userid :string,token:string | null,isRequest:boolean,setIsRequest:(state: boolean) => void) => {
	try {
		const response = await fetch(
			`http://localhost:8080/keyfollow/${userid}`,
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