import React from "react";
import { MessageCircle, Repeat, Heart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tweet, TweetData } from "@/types/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { createLike, deleteLike } from "@/features/like/likes";
import { User } from "@/types/index";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";
import RetweetItem from "@/components/pages/retweetItems";
import { createRetweet, deleteRetweet } from "@/features/retweet/retweets";
import { renderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import { formatDate } from "@/lib/formatDate";
import { useRouter } from "next/navigation";
import { combineTweetData } from "@/lib/combineTweetData";

interface TweetItemProps {
    tweet: Tweet; // tweetをオプショナルに変更
    user: User;
    initialisLiked: boolean;
    initialisRetweeted: boolean;
    type: string;
}

export default function TweetItem({
    tweet,
    user,
    initialisLiked,
    initialisRetweeted,
    type,
}: TweetItemProps) {
    const [isLiked, setIsLiked] = useState(initialisLiked); // 状態を管理
    const [isRetweeted, setIsRetweeted] = useState(initialisRetweeted); // 状態を管理
    const [likeData, setLikeData] = useState<number>(0);
    const [retweetData, setRetweetData] = useState<number>(0);
    const [retweet, setRetweet] = useState<TweetData | null>(null);
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
        const handleAuthChange = () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    if (tweet.retweetid.Valid) {
                        const retweets = await fetchOneTweet(
                            token,
                            tweet.retweetid.Int32
                        );
                        setRetweet(combineTweetData(retweets));
                    }
                } else {
                    console.error("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
        setLikeData(tweet.likes);
        setRetweetData(tweet.retweets);
    }, [auth, tweet]);

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
                if (isLiked) {
                    try {
                        await deleteLike(tweet, token); // トークンを渡す
                        setIsLiked(false); // いいねを消した後に状態を更新
                        setLikeData((prev) => prev - 1);
                    } catch (error) {
                        console.error("いいねの削除に失敗しました:", error);
                    }
                } else {
                    try {
                        await createLike(tweet, token); // トークンを渡す
                        setIsLiked(true); // いいねを追加した後に状態を更新
                        setLikeData((prev) => prev + 1);
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
            if (token) {
                if (isRetweeted) {
                    try {
                        await deleteRetweet(tweet, token); // トークンを渡す
                        setIsRetweeted(false); // いいねを消した後に状態を更新
                        setRetweetData(retweetData - 1);
                    } catch (error) {
                        console.error("いいねの削除に失敗しました:", error);
                    }
                } else {
                    try {
                        await createRetweet(tweet, token); // トークンを渡す
                        setIsRetweeted(true); // いいねを追加した後に状態を更新
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

    const handleTweetClick = (tweetId: number) => {
        router.push(`/tweet/${tweetId}`);
    };

    const Tweetobj = () => {
        return (
            <div className="flex space-x-3">
                {/* ユーザーのアイコン */}
                <div className="relative flex flex-col items-center">
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
                    {/* 縦線を表示 */}
                    <div className={`${type == "reply" ? "h-full border-l-2 border-gray-300 absolute top-10": ""}`}></div>
                </div>

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
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
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
                        <div
                            className="mt-3 mr-10 p-3 border border-gray-200 rounded-lg  hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation(); // 親のクリックイベントをキャンセル
                                handleTweetClick(tweet.retweetid.Int32);
                            }}
                        >
                            <RetweetItem tweet={retweet.tweet} />
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
                                isRetweeted ? "text-green-500" : "text-gray-500"
                            } hover:text-red-500`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRetweetToggle();
                            }}
                        >
                            <Repeat className="h-4 w-4" />
                            <span className="text-xs">{retweetData}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center space-x-2 ${
                                isLiked ? "text-red-500" : "text-gray-500"
                            } hover:text-red-500`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLikeToggle();
                            }}
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    isLiked
                                        ? "fill-current text-red-500"
                                        : "text-gray-500"
                                }`}
                            />
                            <span className="text-xs">{likeData}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-gray-500"
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
        <div>
            {retweet && !tweet.isquote ? (
                <div
                    className="relative hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleTweetClick(tweet.retweetid.Int32)}
                >
                    {/* リツイートメッセージ */}
                    <div className="flex items-center  text-sm text-gray-500 whitespace-nowrap ml-12">
                        <Repeat className="h-3 w-3 text-gray-500" />
                        <span className="font-medium text-gray-600 ml-1">
                            {user?.username}
                        </span>
                        <span className="ml-1">がリツイートしました</span>
                    </div>
                    {/* リツイートされたツイート */}
                    <TweetItem
                        tweet={retweet.tweet}
                        user={retweet.user}
                        initialisLiked={retweet.isLiked}
                        initialisRetweeted={retweet.isRetweeted}
                        type={"tweet"}
                    />
                </div>
            ) : (
                <div
                    className={`p-2 hover:bg-gray-50 transition-colors duration-200 ${
                        type == "tweet" ? "border-b border-gray-200" : ""
                    }`}
                    onClick={() => handleTweetClick(tweet.tweetid)}
                >
                    <Tweetobj />
                </div>
            )}
        </div>
    );
}
