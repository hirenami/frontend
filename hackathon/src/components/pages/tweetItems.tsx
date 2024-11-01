import React from "react";
import { MessageCircle, Repeat, Heart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tweet } from "@/types/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { createLike, deleteLike } from "@/features/like/likes";
import { fetchUserData } from "@/features/user/fetchUserData";
import { fetchLikeStatus } from "@/features/like/fetchLikeStatus";
import { User } from "@/types/index";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";

interface TweetItemProps {
    tweet: Tweet; // tweetをオプショナルに変更
}

export default function TweetItem({ tweet }: TweetItemProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isliked, setIsLiked] = useState<boolean>(false);
    const [likeData, setLikeData] = useState<number>(0);
    const [retweet, setRetweet] = useState<Tweet | null>(null);
    const auth = getAuth();
    useEffect(() => {
        const handleAuthChange = () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    await Promise.all([
                        setUser(await fetchUserData(token, tweet.userid)),
                        setIsLiked(await fetchLikeStatus(token, tweet.tweetid)),
                    ]);
                    if (tweet.retweetid.Valid) {
                        setRetweet(await fetchOneTweet(tweet.retweetid.Int32));
                    }
                } else {
                    console.error("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
        setLikeData(tweet.likes);
    }, [auth, tweet.userid, tweet.tweetid, tweet.likes, tweet.retweetid]);

    if (!tweet) {
        return (
            <div className="p-4 text-gray-500">
                ツイートを読み込めませんでした。
            </div>
        );
    }

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
            if (token) {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString); // ISO文字列をDateオブジェクトに変換
        const now = new Date();
        date.setHours((date.getHours() as number) - 9); // 9時間を追加して日本時間に変換

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

    // ハッシュタグを含むテキストをボタンに変換する関数
    const renderContentWithHashtags = (content: string) => {
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

    const Tweetobj = () => {
        return (
            <div className="flex space-x-3">
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
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 truncate">
                            <button
                                className="text-base font-bold text-gray-900 hover:underline bg-transparent p-0 focus:outline-none"
                                onClick={hundleUserClick}
                            >
                                {user?.username}
                            </button>
                            <button
                                className="text-sm text-gray-500  bg-transparent p-0 focus:outline-none"
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
                    <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                        {renderContentWithHashtags(tweet.content)}
                    </p>
                    {tweet.media_url.Valid && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-[400px]">
                            {tweet.media_url.String.includes("images%") ? (
                                // 画像の場合
                                <Image
                                    src={tweet.media_url.String}
                                    alt="ツイート画像"
                                    width={400}
                                    height={225}
                                    className="w-full h-auto object-cover max-h-[225px]"
                                />
                            ) : tweet.media_url.String.includes("videos%") ? (
                                // 動画の場合
                                <video
                                    src={tweet.media_url.String}
                                    controls
                                    className="w-full h-auto object-cover max-h-[225px]"
                                >
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                            ) : (
                                <p>サポートされていないメディアタイプです。</p> // その他のメディアタイプの場合
                            )}
                        </div>
                    )}
                    {tweet.isquote && retweet && <TweetItem tweet={retweet} />}
                    <div className="mt-3 flex justify-between max-w-md">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-gray-500 hover:text-primary"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{tweet.replies}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-gray-500 hover:text-green-500"
                        >
                            <Repeat className="h-4 w-4" />
                            <span className="text-xs">{tweet.retweets}</span>
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
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-gray-500 hover:text-primary"
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
        <div>
            {retweet && !tweet.isquote ? (
                <div>
                    {/* リツイートメッセージ */}
                    <div className="flex items-center space-x-1 text-sm text-gray-500 -mt-1 ml-auto pl-10 p-1">
                        <Repeat className="h-3 w-3 text-gray-500" />
                        <span className="font-medium text-gray-600">
                            {user?.username}
                        </span>
                        <span>がリツイートしました</span>
                    </div>
                    {/* リツイートされたツイート */}
                    <TweetItem tweet={retweet} />
                </div>
            ) : (
				<div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200">
                <Tweetobj />
				</div>
            )}
        </div>
    );
}
