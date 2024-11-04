"use client";

import Sidebar from "@/components/pages/sidebar";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Tweet, User, TweetData } from "@/types";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { createLike, deleteLike } from "@/features/like/likes";
import { createRetweet, deleteRetweet } from "@/features/retweet/retweets";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    MessageCircle,
    Repeat,
    Heart,
} from "lucide-react";
import { renderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import RetweetItem from "@/components/pages/retweetItems";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {date} from "@/lib/Date";
import { combineTweetData } from "@/lib/combineTweetData";

export default function TweetPage() {
    const { tweetId } = useParams();
    const tweetid = tweetId as unknown as number;
    const [isliked, setIsLiked] = useState<boolean>(false);
    const [likeData, setLikeData] = useState<number>(0);
    const [isretweet, setIsRetweet] = useState<boolean>(false);
    const [retweetData, setRetweetData] = useState<number>(0);
    const [retweet, setRetweet] = useState<TweetData | null>(null);
	const [tweet, setTweet] = useState<Tweet | null>(null);
	const [user, setUser] = useState<User | null>(null);
    const auth = fireAuth;
    const router = useRouter();

    useEffect(() => {
        if (!tweetId) return;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const tweetdata = await fetchOneTweet(token, tweetid);
					const tweetData = combineTweetData(tweetdata);
					setTweet(tweetData.tweet);
					setIsLiked(tweetData.isLiked);
					setLikeData(tweetData.tweet.likes);
					setIsRetweet(tweetData.isRetweeted);
					setRetweetData(tweetData.tweet.retweets);
					setUser(tweetData.user);
					if (tweetData.tweet.retweetid.Valid) {
						const retweetData = await fetchOneTweet(
							token,
							tweetData.tweet.retweetid.Int32
						);
						setRetweet(combineTweetData(retweetData));
					}
                } catch (error) {
                    console.error("ユーザーがログインしていません", error);
                }
                return unsubscribe;
            }
            unsubscribe();
        });
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
            <div className="flex space-x-3 flex-col">
                {/* ユーザーのアイコン */}
                <div className="flex justify-between">
					<div className="flex">
                    <Button
                        className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
                        onClick={hundleUserClick}
                    >
                        <Avatar className="w-full h-full rounded-full">
                            <AvatarImage
                                src={user?.icon_image}
                                alt={user?.userid}
                            />
                            <AvatarFallback>{user?.userid}</AvatarFallback>
                        </Avatar>
                    </Button>

                    {/* ツイートの内容 */}

                    <div className="flex space-x-1 truncate flex-col ml-2">
                        {/* ユーザー名とID */}
                        <button
                            className="text-base font-bold text-gray-900 hover:underline bg-transparent p-0 focus:outline-none"
                            onClick={hundleUserClick}
                        >
                            {user?.username}
                        </button>
                        <button
                            className="text-sm text-gray-500 bg-transparent pr-6 focus:outline-none whitespace-nowrap"
                            onClick={hundleUserClick}
                        >
                            @{user?.userid}
                        </button>
                    </div>
					</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-primary"
                    >
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1 min-w-0">
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
                            <RetweetItem tweet={retweet.tweet} />
                        </div>
                    )}
					
					{/* ツイートの日時 */}
					<div className="mt-3 text-gray-500 text-sm border-b border-gray p-2">
						{date(tweet.created_at)} ・<b>{tweet.impressions}</b>件の表示
					</div>

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
                                    isliked
                                        ? "fill-current text-red-500"
                                        : "text-gray-500"
                                }`}
                            />
                            <span className="text-xs">{likeData}</span>
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
                <header className="sticky top-0 z-10 bg-white bg-opacity-80 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="mr-4 rounded-full p-2 hover:bg-gray-200"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold">
                                    リプライする
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>
                {tweet ? (
                    <div className="p-4 border-b border-gray-200">
                        <Tweetobj />
                    </div>
                ) : (
                    <div className="p-4 text-gray-500">読み込み中...</div>
                )}
            </div>
            <TrendsSidebar />
        </div>
    );
}
