export const date = (dateString: string) => {
	// ISO文字列をDateオブジェクトに変換し、日本時間に変換 (UTC + 9)
	const date = new Date(dateString);
	date.setHours(date.getHours() + 9);

	// 午前/午後の判定
	const hours = date.getHours();
	const period = hours >= 12 ? '午後' : '午前';
	const hour = hours % 12 || 12; // 0時を12時として表示
	const minutes = String(date.getMinutes()).padStart(2, '0');

	// 日付フォーマット
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return `${period}${hour}:${minutes} · ${year}年${month}月${day}日`;
}
