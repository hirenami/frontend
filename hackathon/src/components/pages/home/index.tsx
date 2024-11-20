"use client";

import { useState, useEffect } from "react";
import { TweetData } from "@/types";
import TweetItem from "@/components/pages/tweetitem";
import CreateTweet from "@/components/pages/home/createTweet";
import GetFetcher from "@/routes/getfetcher";

export default function HomePage() {
    const [timelineData, setTimelineData] = useState<TweetData[]>([]);
    const {
        data: timeline,
        error,
        isLoading,
        token,
    } = GetFetcher("http://localhost:8080/timeline");

    // dataが変更されたときにtimelineDataを更新する
    useEffect(() => {
        if (timeline) {
            setTimelineData(timeline);
        }
    }, [timeline]); // dataが変わるたびにsetTimelineDataが実行される

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>再読み込みしてください</p>
            </div>
        );
    }

    return (
        <>
            <header className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Home</h1>
                </div>
            </header>

            <CreateTweet userToken={token} type={"tweet"} tweetId={0} />

            <div>
                {timelineData.map((data, index) => (
                    <TweetItem
                        key={index}
                        type={"tweet"}
                        tweet={data.tweet}
                        user={data.user}
                        initialisLiked={data.likes}
                        initialisRetweeted={data.retweets}
						isblocked={data.isblocked}
						isprivate={data.isprivate}
						token = {token}
                    />
                ))}
            </div>
        </>
    );
}
