"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { TweetData } from "@/types";
import { fetchSearchTweet } from "@/features/search/fetchSearch";
import Sidebar from "@/components/pages/sidebar";
import TweetItem from "@/components/pages/tweetItems";
import { useSearchParams } from "next/navigation";


export default function Component() {
    const [timelineData, setTimelineData] = useState<TweetData[]>([]);
    const auth = getAuth();
	const q = useSearchParams().get("q");

    useEffect(() => {
        const handleAuthChange = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    const timelinedata = await fetchSearchTweet(token,q as string);
                    setTimelineData(timelinedata);
                } else {
                    console.log("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
    }, [auth,q]);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="flex-1 ml-80 mr-120 border-r border-l">

                <div>
                    {timelineData && timelineData.map((data, index) => (
                        <TweetItem
                            key={index}
							type={"tweet"}
                            tweet={data.tweet}
                            user={data.user}
                            initialisLiked={data.likes}
                            initialisRetweeted={data.retweets}
                        />
                    ))}
                </div>
            </main>

            <TrendsSidebar />
        </div>
    );
}
