import React from "react";
import { Button } from "@/components/ui/button";
import { Tweet } from "@/types/index";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/index";
import { formatDate } from "@/lib/formatDate";
import { RenderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import GetFetcher from "@/routes/getfetcher";

interface TweetItemProps {
    tweet: Tweet; // tweetをオプショナルに変更
    isblocked: boolean;
    isprivate: boolean;
}

export default function RetweetItem({
    tweet,
    isblocked,
    isprivate,
}: TweetItemProps) {
    const [user, setUser] = useState<User | null>(null);

    const { data, error, token } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/user/${tweet.userid}`
    );

    useEffect(() => {
        if (data) {
            setUser(data.user);
        }
    }, [data]);

    if (!tweet || error) {
        return (
            <div className="p-4 text-gray-500">
                ツイートを読み込めませんでした。
            </div>
        );
    }

    const hundleUserClick = async () => {
        try {
            if (token) {
                window.location.href = `/profile/${user?.userid}`; // ユーザーページへ遷移
            }
        } catch (error) {
            console.error("ユーザーページへの遷移に失敗しました:", error);
        }
    };

    if (isblocked) {
        return (
            <div className="flex flex-col items-center justify-center  rounded-md text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    ブロックされているため、このツイートは表示できません。
                </p>
            </div>
        );
    }
    if (isprivate) {
        return (
            <div className="flex flex-col items-center justify-center rounded-md  text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    作成者が表示範囲を設定しているため、このツイートは表示できません。
                </p>
            </div>
        );
    }

    if (tweet.isdeleted) {
        return (
            <div className="flex flex-col items-center justify-center   rounded-md  text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    このツイートは、ツイートの制作者により削除されました。
                </p>
            </div>
        );
    }

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
                <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap break-all">
                    {RenderContentWithHashtags(tweet.content)}
                </p>
                {tweet.media_url && tweet.media_url !== '""' && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-[400px]">
                        {tweet.media_url.includes("images%") ? (
                            // 画像の場合
                            <Image
                                src={tweet.media_url}
                                alt="ツイート画像"
                                width={400}
                                height={225}
                                className="w-full h-auto object-cover max-h-[225px]"
                            />
                        ) : tweet.media_url.includes("videos%") ? (
                            // 動画の場合
                            <video
                                src={tweet.media_url}
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
