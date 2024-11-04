"use client";

import Sidebar from "@/components/pages/sidebar";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Tweet,User } from "@/types";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { fetchUserData } from "@/features/user/fetchUserData";
import { fetchLikeStatus } from "@/features/like/fetchLikeStatus";
import { fetchRetweetStatus } from "@/features/retweet/fetchRetweetStatus";
import { createLike, deleteLike } from "@/features/like/likes";
import { createRetweet, deleteRetweet } from "@/features/retweet/retweets";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Repeat, Heart, BarChart } from "lucide-react";
import { renderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import { formatDate } from "@/lib/formatDate";
import RetweetItem from "@/components/pages/retweetItems";
import  Image from "next/image";

export default function TweetPage() {
    const { tweetId } = useParams();
    const tweetid = tweetId as unknown as number;
    const [tweet, setTweet] = useState<Tweet | null>(null);
	const [user, setUser] = useState<User | null>(null);
    const [isliked, setIsLiked] = useState<boolean>(false);
    const [likeData, setLikeData] = useState<number>(0);
	const [isretweet, setIsRetweet] = useState<boolean>(false);
	const [retweetData, setRetweetData] = useState<number>(0);
    const [retweet, setRetweet] = useState<Tweet | null>(null);
	const auth = fireAuth

    useEffect(() => {
		if (!tweetId) return;
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const token = await user.getIdToken();
					const tweetData = await fetchOneTweet(token,tweetid);
					setTweet(tweetData);
					await Promise.all([
						setUser(await fetchUserData(token, tweetData.userid)),
						setIsLiked(await fetchLikeStatus(token, tweetData.tweetid)),
						setIsRetweet(await fetchRetweetStatus(token, tweetData.tweetid)),
					]);
					if (tweetData.retweetid.Valid) {
                        setRetweet(await fetchOneTweet(token,tweetData.retweetid.Int32));
                    }
					setLikeData(tweetData.likes);
		setRetweetData(tweetData.retweets);
                } catch (error) {
                    console.error("ユーザーがログインしていません", error);
                }
            return unsubscribe;
        };
        unsubscribe();
	}
		);
	}, [auth, tweetid, tweetId]);
		

	const hundleUserClick = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            if (token) {
                window.location.href = `/profile/${user?.userid}`; // ユーザーページへ遷移
            }
        } catch (error) {
            console.error("ユーザーページへの遷移に失敗しました:", error);
        }
    };

    const handleLikeToggle = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
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
            const token = await auth.currentUser?.getIdToken();
            if (token && tweet) {
                if (isretweet) {
                    try {
                        await deleteRetweet(tweet, token); // トークンを渡す
                        setIsRetweet(false); // いいねを消した後に状態を更新
                        setRetweetData(retweetData - 1);
                    } catch (error) {
                        console.error("いいねの削除に失敗しました:", error);
                    }
                } else {
                    try {
                        await createRetweet(tweet, token); // トークンを渡す
                        setIsRetweet(true); // いいねを追加した後に状態を更新
                        setRetweetData(retweetData + 1);
                    } catch (error) {
                        console.error("いいねの追加に失敗しました:", error);
                    }
                }
            }
        } catch (error) {
            console.error("いいねのトグルに失敗しました:", error);
        }
    };

	const Tweetobj = () => {
		if (!tweet || !user) return null;
		return (
			<div className="flex space-x-3">
				{/* ユーザーのアイコン */}
				<Button
					className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
					onClick={hundleUserClick}
				>
					<Avatar className="w-full h-full rounded-full">
						<AvatarImage src={user?.icon_image} alt={user?.userid} />
						<AvatarFallback>{user?.userid}</AvatarFallback>
					</Avatar>
				</Button>
	
				{/* ツイートの内容 */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-1 truncate">
							{/* ユーザー名とID */}
							<button
								className="text-base font-bold text-gray-900 hover:underline bg-transparent p-0 focus:outline-none"
								onClick={hundleUserClick}
							>
								{user?.username}
							</button>
							<button
								className="text-sm text-gray-500 bg-transparent p-0 focus:outline-none"
								onClick={hundleUserClick}
							>
								@{user?.userid}
							</button>
							<span className="text-gray-500 text-sm">·</span>
							<span className="text-gray-500 text-sm">
								{formatDate(tweet.created_at)}
							</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-500 hover:text-primary"
						>
							<MoreHorizontal className="h-5 w-5" />
						</Button>
					</div>
	
					{/* ツイートのテキスト */}
					<p className="text-lg text-gray-900 whitespace-pre-wrap">
						{renderContentWithHashtags(tweet.content)}
					</p>
	
					{/* メディア（画像または動画） */}
					{tweet.media_url.Valid && (
						<div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-[400px]">
							{tweet.media_url.String.includes("images%") ? (
								<Image
									src={tweet.media_url.String}
									alt="ツイート画像"
									width={400}
									height={225}
									className="w-full h-auto object-cover max-h-[225px]"
								/>
							) : tweet.media_url.String.includes("videos%") ? (
								<video
									src={tweet.media_url.String}
									controls
									className="w-full h-auto object-cover max-h-[225px]"
								>
									お使いのブラウザは動画タグをサポートしていません。
								</video>
							) : (
								<p>サポートされていないメディアタイプです。</p>
							)}
						</div>
					)}
	
					{/* 引用リツイートされたツイート */}
					{tweet.isquote && retweet && (
						<div className="mt-3 mr-10 p-3 border border-gray-200 rounded-lg  hover:bg-gray-100">
							<RetweetItem tweet={retweet} />
						</div>
					)}
	
					{/* アクションボタン群 */}
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
							<span className="text-xs">{retweetData}</span>
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
									isliked ? "fill-current text-red-500" : "text-gray-500"
								}`}
							/>
							<span className="text-xs">{likeData}</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center space-x-2 text-gray-500 hover:text-primary"
							//onClick={handleImpressionsClick}
						>
							<BarChart className="h-4 w-4" />
							<span className="text-xs">{tweet.impressions}</span>
						</Button>
					</div>
				</div>
			</div>
		);
	};


    return (
        <div className="flex">
            <Sidebar />
            <div className="min-h-screen bg-white text-black flex-1 ml-80 mr-120 border-l border-r overflow-hidden">
                {tweet ? (
                    <div className="p-4 border-b border-gray-200">
						<Tweetobj />
					</div>
                ) : (
                    <div className="p-4 text-gray-500">
                        読み込み中...
                    </div>
                )}
            </div>
            <TrendsSidebar />
        </div>
    );
}
