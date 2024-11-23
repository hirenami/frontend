import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// ハッシュタグを含むテキストをボタンに変換する関数
export const RenderContentWithHashtags = (content: string) => {
	const hashtagRegex = /#\p{L}[\p{L}\p{N}_]*/gu; // ハッシュタグの正規表現
	const parts = content.split(hashtagRegex);
	const hashtags = content.match(hashtagRegex) || []; // マッチしたハッシュタグを取得
	const router = useRouter();

	return parts.flatMap((part, index) => {
		const result = [<span key={`text-${index}`}>{part}</span>]; // テキスト部分をspanで囲む
		if (index < hashtags.length) {
			result.push(
				<Button
					key={`hashtag-${index}`}
					variant="link"
					className="text-blue-500 hover:underline"
					onClick = {
						(e) => {
							e.stopPropagation();  // イベントのデフォルト動作を防ぐ
							router.push(`/search?q=${encodeURIComponent(hashtags[index])}`); // ハッシュタグがクリックされた時の処理
						  }
					} // ハッシュタグがクリックされた時の処理
				>
					{hashtags[index]} {/* ハッシュタグをボタンにする */}
				</Button>
			);
		}
		return result;
	});
};