
export default function UpdatePrivate(token: string, isPrivate: boolean) {
	fetch("https://backend-71857953091.us-central1.run.app/user/private", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(isPrivate),
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Failed to update private setting");
			}
		})
		.catch((err) => {
			console.error(err);
		});
}


