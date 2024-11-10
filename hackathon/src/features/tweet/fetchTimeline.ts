export const fetchTimeline = async (token: string) => {
	try {
		const response = await fetch("http://localhost:8080/timeline", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error("タイムラインの取得に失敗しました");
		}

		const TimelineData = await response.json();
		console.log("Timeline Data:", TimelineData);
		return TimelineData;
	} catch (error) {
		console.error("タイムラインの取得に失敗しました:", error);
	}
};