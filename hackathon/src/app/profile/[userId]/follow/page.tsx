"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/pages/sidebar";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { fetchUserData } from "@/features/user/fetchUserData";
import { fetchFollows, fetchFollowers } from "@/features/user/fetchFollowCount";
import { User, FollowData } from "@/types";
import { useRouter,useSearchParams } from "next/navigation";
import Follow from "@/components/pages/follow";

export default function Component() {
	const router = useRouter();
	const tab = useSearchParams().get("tab");
    const [activeTab, setActiveTab] = useState<string>(tab || "followers");
    const auth = fireAuth;
    const { userId } = useParams();
    const userid = userId as string;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [follows, setFollows] = useState<FollowData[]>([]);
    const [followers, setFollowers] = useState<FollowData[]>([]);
    const [followsCount, setFollowsCount] = useState<number>(0);
    const [followersCount, setFollowersCount] = useState<number>(0);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();

                try {
                    const userData = await fetchUserData(token, userid);
                    const followsData = await fetchFollows(token, userid);
                    const followersData = await fetchFollowers(token, userid);
                    setUser(userData.user);
                    setFollows(followsData);
                    setFollowers(followersData);
                    setFollowsCount(userData.follows);
                    setFollowersCount(userData.followers);
                } catch (error) {
                    console.error("データの取得に失敗しました:", error);
                }
            } else {
                console.error("ユーザーがログインしていません");
            }
            setLoading(false);
        });

        // クリーンアップ関数でイベントリスナーを解除
        return () => unsubscribe();
    }, [userId, auth, userid]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }

	if(!user){
		return (
			<div className="flex min-h-screen items-center justify-center bg-white text-black">
				<p>ユーザーが見つかりません</p>
			</div>
		);
	}

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-80 mr-120 border-r border-l">
                <header className="sticky top-0 z-10 bg-white bg-opacity-80 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="mr-4 rounded-full p-2 hover:bg-gray-200"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold">
                                    {user?.username}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    @{user?.userid}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <Tabs
                    defaultValue={ activeTab} 
                    className="w-full"
                    onValueChange={setActiveTab}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="followers">
                            フォロワー
                            <span className="ml-2 text-sm text-muted-foreground">
                                {followersCount}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="follows">
                            フォロー中
                            <span className="ml-2 text-sm text-muted-foreground">
                                {followsCount}
                            </span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="followers">
                        {followers.map((follower, index) => (
                            <Follow key={index} follower={follower} index={index} />
                        ))}
                    </TabsContent>
                    <TabsContent value="follows">
                        {follows.map((follow, index) => (
                             <Follow key={index} follower={follow} index={index} />
                        ))}
                    </TabsContent>
                </Tabs>
            </main>
            <TrendsSidebar />
        </div>
    );
}
