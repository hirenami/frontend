export const fetchNotificationData = async (token: string) => {
	try {
		const Response = await fetch(
			`http://localhost:8000/notifications`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!Response.ok) {
			throw new Error("通知の取得に失敗しました");
		}

		const Datas = await Response.json();
		console.log("Notification Datas:", Datas);
		return Datas;
	} catch (error) {
		console.error("通知の取得に失敗しました:", error);
	}
};