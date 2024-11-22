import React, { useEffect, useState } from "react";
import { Repeat, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tweet, TweetData, User } from "@/types/index";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RetweetItem from "@/components/pages/tweet/components/retweetItems";
import { renderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import { formatDate } from "@/lib/formatDate";
import { useRouter } from "next/navigation";
import { fireAuth } from "@/features/firebase/auth";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";
import MenuComponent from "@/components/pages/tweet/components/menu";
import ActionButton from "./component/actionbutton";

interface TweetItemProps {
    tweet: Tweet;
    user: User;
    initialisLiked: boolean;
    initialisRetweeted: boolean;
    type: string;
    isblocked: boolean;
    isprivate: boolean;
    token: string | null;
}

export default function TweetItem({
    tweet,
    user,
    initialisLiked,
    initialisRetweeted,
    type,
    isblocked,
    isprivate,
    token,
}: TweetItemProps) {
    const [isLiked, setIsLiked] = useState(initialisLiked); // 状態を管理
    const [isRetweeted, setIsRetweeted] = useState(initialisRetweeted); // 状態を管理
    const [likeData, setLikeData] = useState<number>(0);
    const [retweetCount, setRetweetCount] = useState<number>(0);
    const [retweet, setRetweet] = useState<TweetData | null>(null);
    const router = useRouter();
    const auth = fireAuth;

    useEffect(() => {
        const fetchdata = async () => {
            if (tweet.retweetid && token) {
                try {
                    const data = await fetchOneTweet(token, tweet.retweetid);
                    if (data) {
                        setRetweet(data);
                    }
                } catch (error) {
                    console.error(
                        "エラーが発生しました:",
                        error
                    );
                }
            }
        };
        fetchdata();
        if (tweet.likes) {
            setLikeData(tweet.likes);
        }
        if (tweet.retweets) {
            setRetweetCount(tweet.retweets);
        }
    }, [tweet.retweetid, tweet.likes, tweet.retweets, token]);

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
                    <div
                        className={`${
                            type == "reply"
                                ? "h-full border-l-2 border-gray-300 absolute top-10"
                                : ""
                        }`}
                    ></div>
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
						{tweet.review > 0 &&  (
							<div className="flex items-center space-x-1">
							<span className="sr-only">{tweet.review}つ星のレビュー</span>
							{[...Array(5)].map((_, i) => (
							  <Star
								key={i}
								className={`w-4 h-4 ${
								  i < tweet.review ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
								}`}
							  />
							))}
						  </div>)}
                        <MenuComponent
                            tweet={tweet}
                            token={token}
                            isliked={isLiked}
                            setIsLiked={setIsLiked}
                            likeData={likeData}
                            setLikeData={setLikeData}
                            isretweet={isRetweeted}
                            setIsRetweet={setIsRetweeted}
                            retweetCount={retweetCount}
                            setRetweetCount={setRetweetCount}
                        />
                    </div>

                    {/* ツイートのテキスト */}
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {renderContentWithHashtags(tweet.content)}
                    </p>

                    {/* メディア（画像または動画） */}
                    {tweet.media_url && tweet.media_url !== '""' && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-[400px]">
                            {tweet.media_url.includes("images%") ? (
                                <Image
                                    src={tweet.media_url}
                                    alt="ツイート画像"
                                    width={400}
                                    height={225}
                                    className="w-full h-auto object-cover max-h-[225px]"
                                />
                            ) : tweet.media_url.includes("videos%") ? (
                                <video
                                    src={tweet.media_url}
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
                                handleTweetClick(tweet.retweetid);
                            }}
                        >
                            <RetweetItem
                                tweet={retweet.tweet}
                                isblocked={retweet.isblocked}
                                isprivate={retweet.isprivate}
                            />
                        </div>
                    )}

                    {isblocked || isprivate || tweet.isdeleted ? null : (
                        <ActionButton
                            tweet={tweet}
                            token={token}
                            isliked={isLiked}
                            setIsLiked={setIsLiked}
                            likeData={likeData}
                            setLikeData={setLikeData}
                            isretweet={isRetweeted}
                            setIsRetweet={setIsRetweeted}
                            retweetCount={retweetCount}
                            setRetweetCount={setRetweetCount}
                            isblocked={isblocked}
                            isprivate={isprivate}
                        />
                    )}
                </div>
            </div>
        );
    };

    if (tweet.isdeleted) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50 text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    このツイートは、ツイートの制作者により削除されました。
                </p>
            </div>
        );
    }

    if (isblocked) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border  rounded-md text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    ブロックされているため、このツイートは表示できません。
                </p>
            </div>
        );
    }
    if (isprivate) {
        return (
            <div className="flex flex-col items-center justify-center  p-4 border rounded-md  text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    作成者が表示範囲を設定しているため、このツイートは表示できません。
                </p>
            </div>
        );
    }

    return (
        <div>
            {retweet && !tweet.isquote ? (
                <div
                    className="relative hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleTweetClick(tweet.retweetid)}
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
                        initialisLiked={retweet.likes}
                        initialisRetweeted={retweet.retweets}
                        type={"tweet"}
                        isblocked={retweet.isblocked}
                        isprivate={retweet.isprivate}
                        token={token}
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
