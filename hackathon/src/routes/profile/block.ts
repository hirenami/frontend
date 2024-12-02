
export const createblock = (token: string | null, blockId: string | undefined) => {
	fetch(`https://backend-71857953091.us-central1.run.app/block/${blockId}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})
		.then((res) => {
			if (res.ok) {
				console.log("ブロック成功");
			} else {
				throw new Error("ブロック失敗");
			}
		})
		.catch((error) => {
			console.error("ブロック中にエラーが発生しました:", error);
		});
}

export const deleteblock = (token: string | null, blockId: string | undefined) => {
	fetch(`https://backend-71857953091.us-central1.run.app/block/${blockId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})
		.then((res) => {
			if (res.ok) {
				console.log("ブロック解除成功");
			} else {
				throw new Error("ブロック解除失敗");
			}
		})
		.catch((error) => {
			console.error("ブロック解除中にエラーが発生しました:", error);
		});
}