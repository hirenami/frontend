export const updateNotificationStatus = async (token: string, notificationId: number) => {
	try {
		const Response = await fetch(
			`https://backend-71857953091.us-central1.run.app/notifications/${notificationId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!Response.ok) {
			throw new Error("通知の更新に失敗しました");
		}
	} catch (error) {
		console.error("通知の更新に失敗しました:", error);
	}
};