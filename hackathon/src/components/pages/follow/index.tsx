"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FollowData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Follow from "@/components/pages/follow/components/follow";
import GetFetcher from "@/routes/getfetcher";

export default function FollowPage() {
    const router = useRouter();
    const tab = useSearchParams().get("tab");
    const [activeTab, setActiveTab] = useState<string>(tab || "followers");
    const { userId } = useParams();
    const userid = userId as string;
    const [user, setUser] = useState<User | null>(null);
    const [follows, setFollows] = useState<FollowData[]>([]);
    const [followers, setFollowers] = useState<FollowData[]>([]);
    const [followsCount, setFollowsCount] = useState<number>(0);
    const [followersCount, setFollowersCount] = useState<number>(0);

    const {
        data: userData,
        error: error1,
        isLoading: isLoading1,
    } = GetFetcher(`http://localhost:8080/user/${userid}`);
    const {
        data: followsData,
        error: error2,
        isLoading: isLoading2,
    } = GetFetcher(`http://localhost:8080/follow/${userid}/following`);
    const {
        data: followersData,
        error: error3,
        isLoading: isLoading3,
    } = GetFetcher(`http://localhost:8080/follow/${userid}/follower`);

    useEffect(() => {
        if (userData && followsData && followersData) {
            setUser(userData.user);
            setFollows(followsData);
            setFollowers(followersData);
            setFollowsCount(userData.follows);
            setFollowersCount(userData.followers);
        }
    }, [userData, followsData, followersData]);

    if (isLoading1 || isLoading2 || isLoading3 || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }

    if (error1 || error2 || error3) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>再読み込みしてください</p>
            </div>
        );
    }

    return (
        <>
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
                defaultValue={activeTab}
                className="w-full"
                onValueChange={setActiveTab}
            >
                <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger value="followers" className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none">
                        フォロワー
                        <span className="ml-2 text-sm text-muted-foreground">
                            {followersCount}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="follows" className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none">
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
        </>
    );
}
