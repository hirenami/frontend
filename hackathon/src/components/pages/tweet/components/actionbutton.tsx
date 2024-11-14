import { Button } from "@/components/ui/button";
import { MessageCircle, Repeat, Heart } from "lucide-react";
import { createLike, deleteLike } from "@/features/like/likes";
import { createRetweet, deleteRetweet } from "@/features/retweet/handleretweets";
import { Tweet } from "@/types";


interface ActionButtonProps {
	tweet: Tweet;
	token: string | null;
	isliked: boolean;
	setIsLiked: (isLiked: boolean) => void;
	likeData: number;
	setLikeData: (likeData: number) => void;
	isretweet: boolean;
	setIsRetweet: (isRetweet: boolean) => void;
	retweetCount: number;
	setRetweetCount: (retweetCount: number) => void;
}

export  default function ActionButton( { tweet, token, isliked, setIsLiked, likeData, setLikeData, isretweet, setIsRetweet, retweetCount, setRetweetCount }: ActionButtonProps) {

	const handleLikeToggle = async () => {
		try {
			if (token && tweet) {
				if (isliked) {
					try {
						await deleteLike(tweet, token); // トークンを渡す
						setIsLiked(false); // いいねを消した後に状態を更新
						setLikeData(likeData - 1);
					} catch (error) {
						console.error("いいねの削除に失敗しました:", error);
					}
				} else {
					try {
						await createLike(tweet, token); // トークンを渡す
						setIsLiked(true); // いいねを追加した後に状態を更新
						setLikeData(likeData + 1);
					} catch (error) {
						console.error("いいねの追加に失敗しました:", error);
					}
				}
			}
		} catch (error) {
			console.error("いいねのトグルに失敗しました:", error);
		}
	};
	
	const handleRetweetToggle = async () => {
		try {
			if (token && tweet) {
				if (isretweet) {
					try {
						await deleteRetweet(tweet, token); // トークンを渡す
						setIsRetweet(false); // いいねを消した後に状態を更新
						setRetweetCount(retweetCount - 1);
					} catch (error) {
						console.error("いいねの削除に失敗しました:", error);
					}
				} else {
					try {
						await createRetweet(tweet, token); // トークンを渡す
						setIsRetweet(true); // いいねを追加した後に状態を更新
						setRetweetCount(retweetCount + 1);
					} catch (error) {
						console.error("いいねの追加に失敗しました:", error);
					}
				}
			}
		} catch (error) {
			console.error("いいねのトグルに失敗しました:", error);
		}
	};

	return (
		
		<div className="mt-3 flex justify-between max-w-md">
		<Button
			variant="ghost"
			size="sm"
			className="flex items-center space-x-2 text-gray-500 hover:text-primary"
			//onClick={handleReplyClick}
		>
			<MessageCircle className="h-4 w-4" />
			<span className="text-xs">{tweet.replies}</span>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			className={`flex items-center space-x-2 ${
				isretweet ? "text-green-500" : "text-gray-500"
			} hover:text-red-500`}
			onClick={handleRetweetToggle}
		>
			<Repeat className="h-4 w-4" />
			<span className="text-xs">{retweetCount}</span>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			className={`flex items-center space-x-2 ${
				isliked ? "text-red-500" : "text-gray-500"
			} hover:text-red-500`}
			onClick={handleLikeToggle}
		>
			<Heart
				className={`h-4 w-4 ${
					isliked
						? "fill-current text-red-500"
						: "text-gray-500"
				}`}
			/>
			<span className="text-xs">{likeData}</span>
		</Button>
	</div>
	);
}