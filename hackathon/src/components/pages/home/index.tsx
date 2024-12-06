"use client";

import { useState, useEffect } from "react";
import { TweetData } from "@/types";
import TweetItem from "@/components/pages/tweetitem";
import CreateTweet from "@/components/pages/home/createTweet";
import GetFetcher from "@/routes/getfetcher";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import UserEditor from "@/components/pages/profile/components/edit";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
    const [timelineData, setTimelineData] = useState<TweetData[]>([]);
    const [open, setOpen] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const isopen = searchParams.get("isopen") || "";

    useEffect(() => {
        if (isopen === "true") {
            setOpen(true);
        }
    }, [isopen]);

    const {
        data: timeline,
        error,
        isLoading,
        token,
    } = GetFetcher("https://backend-71857953091.us-central1.run.app/timeline");

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

            <CreateTweet userToken={token} type={"tweet"} tweet={null} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full sm:max-w-[600px] h-full sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden">
                    <UserEditor setOpen={setOpen} />
                </DialogContent>
            </Dialog>

            <div>
                {timelineData.map((data, index) => (
                    <TweetItem
                        key={index}
                        type={"tweet"}
                        tweet={data.tweet}
                        retweet={data.retweet}
                        user={data.user}
                        initialisLiked={data.likes}
                        initialisRetweeted={data.retweets}
                        isblocked={data.isblocked}
                        isprivate={data.isprivate}
                        token={token}
                    />
                ))}
            </div>
        </>
    );
}
