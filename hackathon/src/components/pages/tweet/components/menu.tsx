"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Tweet, User } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import { useEffect, useState } from "react";
import { createLike, deleteLike } from "@/routes/like/likes";
import { createRetweet, deleteRetweet } from "@/routes/retweet/handleretweets";
import { deleteTweet } from "@/routes/tweet/deleteTweet";

interface Props {
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

export default function Component({
    tweet,
    token,
    isliked,
    setIsLiked,
    likeData,
    setLikeData,
    isretweet,
    setIsRetweet,
    retweetCount,
    setRetweetCount,
}: Props) {
    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (token && tweet) {
                if (isliked) {
                    await deleteLike(tweet, token);
                    setIsLiked(false);
                    setLikeData(likeData - 1);
                } else {
                    await createLike(tweet, token);
                    setIsLiked(true);
                    setLikeData(likeData + 1);
                }
            }
        } catch (error) {
            console.error("いいねのトグルに失敗しました:", error);
        }
    };

    const handleRetweetToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (token && tweet) {
                if (isretweet) {
                    await deleteRetweet(tweet, token);
                    setIsRetweet(false);
                    setRetweetCount(retweetCount - 1);
                } else {
                    await createRetweet(tweet, token);
                    setIsRetweet(true);
                    setRetweetCount(retweetCount + 1);
                }
            }
        } catch (error) {
            console.error("リツイートのトグルに失敗しました:", error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (token && tweet) {
                await deleteTweet(tweet.tweetid, token);
            }
        } catch (error) {
            console.error("ツイートの削除に失敗しました:", error);
        }
    };

    const [user, setUser] = useState<User | null>(null);
    const { data: UserData } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );
    useEffect(() => {
        if (UserData) {
            setUser(UserData.user);
        }
    }, [UserData]);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="その他のオプション"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>メニュー</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => handleLikeToggle(e)}>
                    {isliked ? "いいねを取り消す" : "いいねする"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleRetweetToggle(e)}>
                    {isretweet ? "リツイートを取り消す" : "リツイートする"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tweet.userid == user?.userid && (
                    <DropdownMenuItem
                        onClick={(e) => handleDelete(e)}
                        className="text-red-600"
                    >
                        削除
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
