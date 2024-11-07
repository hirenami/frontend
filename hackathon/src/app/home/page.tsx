"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { TweetData } from "@/types";
import { fetchTimeline } from "@/features/tweet/fetchTimeline";
import Sidebar from "@/components/pages/sidebar";
import TweetItem from "@/components/pages/tweetItems";
import { Tweet as TweetComponent } from "@/components/pages/tweet";
import { combineTweetDatas } from "@/lib/combineTweetData";

export default function Component() {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [timelineData, setTimelineData] = useState<TweetData[]>([]);
    const auth = getAuth();

    useEffect(() => {
        const handleAuthChange = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    setUserToken(token);
                    const timelinedata = await fetchTimeline(token);
                    setTimelineData(combineTweetDatas(timelinedata));
                } else {
                    console.log("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
    }, [auth]);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="flex-1 ml-80 mr-120 border-r border-l">
                <header className="border-b p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Home</h1>
                        <div className="relative">
                            <h1 className="text-xl font-bold">Video</h1>
                        </div>
                    </div>
                </header>

                <TweetComponent
                    userToken={userToken}
                    type={"tweet"}
                    tweetId={0}
                />

                <div>
                    {timelineData.map((data, index) => (
                        <TweetItem
                            key={index}
							type={"tweet"}
                            tweet={data.tweet}
                            user={data.user}
                            initialisLiked={data.isLiked}
                            initialisRetweeted={data.isRetweeted}
                        />
                    ))}
                </div>
            </main>

            <TrendsSidebar />
        </div>
    );
}
