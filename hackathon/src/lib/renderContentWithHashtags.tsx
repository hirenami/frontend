import { Button } from "@/components/ui/button";

// ハッシュタグを含むテキストをボタンに変換する関数
export const renderContentWithHashtags = (content: string) => {
	const hashtagRegex = /#\p{L}[\p{L}\p{N}_]*/gu; // ハッシュタグの正規表現
	const parts = content.split(hashtagRegex);
	const hashtags = content.match(hashtagRegex) || []; // マッチしたハッシュタグを取得

	return parts.flatMap((part, index) => {
		const result = [<span key={`text-${index}`}>{part}</span>]; // テキスト部分をspanで囲む
		if (index < hashtags.length) {
			result.push(
				<Button
					key={`hashtag-${index}`}
					variant="link"
					className="text-blue-500 hover:underline"
				>
					{hashtags[index]} {/* ハッシュタグをボタンにする */}
				</Button>
			);
		}
		return result;
	});
};