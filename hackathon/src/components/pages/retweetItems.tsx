import React from "react";
import { Button } from "@/components/ui/button";
import { Tweet } from "@/types/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchUserData } from "@/features/user/fetchUserData";
import { User } from "@/types/index";

interface TweetItemProps {
    tweet: Tweet; // tweetをオプショナルに変更
}

export default function RetweetItem({ tweet }: TweetItemProps) {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();
    useEffect(() => {
        const handleAuthChange = () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    await Promise.all([
                        setUser(await fetchUserData(token, tweet.userid)),
                    ]);
            
                    
                } else {
                    console.error("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
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

    return (
        <div className="flex space-x-3">
            <Button
                className="w-7 h-7 p-0 flex items-center justify-center rounded-full"
                onClick={hundleUserClick}
            >
                <Avatar className="w-full h-full rounded-full">
                    <AvatarImage src={user?.icon_image} alt={user?.userid} />
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
            </div>
        </div>
    );
}
