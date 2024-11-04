"use client";

import Sidebar from "@/components/pages/sidebar";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Tweet } from "@/types";
import TweetItem from "@/components/pages/tweetItems";
import { fetchOneTweet } from "@/features/tweet/fetchOneTweet";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";

export default function TweetPage() {
    const { tweetId } = useParams();
    const tweetid = tweetId as unknown as number;
    const [tweet, setTweet] = useState<Tweet | null>(null);
	const auth = fireAuth

    useEffect(() => {
		if (!tweetId) return;
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const token = await user.getIdToken();
					const tweetData = await fetchOneTweet(token,tweetid);
					setTweet(tweetData);
				}
				catch (error) {
					console.error("ツイートデータの取得に失敗しました:", error);
				}
			}
			else {
				console.error("ユーザーがログインしていません");
			}
		});
		return () => unsubscribe();
	}, [tweetId, tweetid, auth]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="min-h-screen bg-white text-black flex-1 ml-80 mr-120 border-l border-r overflow-hidden">
                {tweet ? (
                    <TweetItem tweet={tweet} />
                ) : (
                    <div className="p-4 text-gray-500">
                        ツイートを読み込めませんでした。
                    </div>
                )}
            </div>
            <TrendsSidebar />
        </div>
    );
}
