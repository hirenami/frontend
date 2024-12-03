export async function sendProductData(id: string, categories: string, title: string, price: number, description: string, image: string) {
	const payload = {
		id: id,
		categories: [categories],
		title: title,
		priceInfo: {
			price: price,
			currencyCode: "JPY",
		},
		description: description,
		availability: "IN_STOCK",
		images: [{ uri: image, width: 300, height: 300 }],
	};

	const response = await fetch("https://backend-71857953091.us-central1.run.app/api/import-products", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const error = await response.text();
		console.error("Error:", error);
	} else {
		const data = await response.json();
		console.log("Response:", data);
	}
}
