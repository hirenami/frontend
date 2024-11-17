
export default function UpdatePrivate(token : string, isPrivate : boolean) {
	fetch("http://localhost:8080/user/private", {
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


