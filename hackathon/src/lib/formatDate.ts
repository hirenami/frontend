export const formatDate = (dateString: string) => {
	const date = new Date(dateString); // ISO文字列をDateオブジェクトに変換
	const now = new Date();
	date.setHours((date.getHours() as number)); 

	const diffInMs = now.getTime() - date.getTime(); // ミリ秒の差分を計算
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInHours < 24) {
		// 24時間以内なら「何時間前」
		return `${diffInHours}時間`;
	} else if (diffInDays < 365) {
		// 1年未満なら「日付」
		return date.toLocaleDateString("ja-JP", {
			month: "short",
			day: "numeric",
		});
	} else {
		// 1年以上前なら「年と日付」
		return date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
};