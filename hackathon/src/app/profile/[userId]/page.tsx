"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Edit3, UserPlus, UserCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fireAuth } from "@/features/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/pages/sidebar";
import TweetItem from "@/components/pages/tweetItems";
import { TweetData, User } from "@/types";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { Button } from "@/components/ui/button";
import { fetchUserData } from "@/features/user/fetchUserData";
import { fetchTweetsData } from "@/features/tweet/fetchTweetData";
import { combineTweetDatas } from "@/lib/combineTweetData";

export default function ProfilePage() {
    const { userId } = useParams();
    const router = useRouter();
    const auth = fireAuth;
    const userid = userId as string;

    const [user, setUser] = useState<User | null>(null);
    const [tweets, setTweets] = useState<TweetData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCount, setFollowCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setCurrentUserId(user.uid);

                try {
                    const [userData, tweetsData] = await Promise.all([
                        fetchUserData(token, userid),
                        fetchTweetsData(token, userid),
                    ]);

                    setUser(userData.user);
                    setTweets(combineTweetDatas(tweetsData));
                    console.log(combineTweetDatas(tweetsData));
                    setFollowCount(userData.following);
                    setFollowerCount(userData.follower);
                    setIsFollowing(userData.isfollow);
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

    const handleFollow = async () => {
        if (!currentUserId || !userId) return;

        try {
            const token = await fireAuth.currentUser?.getIdToken();
            const response = await fetch(
                `http://localhost:8000/follow/${userId}`,
                {
                    method: isFollowing ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                setIsFollowing(!isFollowing);
                setFollowerCount(
                    isFollowing ? followerCount - 1 : followerCount + 1
                );
            } else {
                throw new Error("フォロー操作に失敗しました");
            }
        } catch (error) {
            console.error("フォロー操作中にエラーが発生しました:", error);
        }
    };

    const handleFollowCount = () => {
        router.push(`/profile/${userid}/follow`);
    };

    const handleEditProfile = () => {
        router.push(`/profile/setting`);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>ユーザーが見つかりません。</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="min-h-screen bg-white text-black flex-1 ml-80 mr-120 border-l border-r overflow-hidden">
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
                                    {user.username}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {tweets.length} ポスト
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="relative">
                    <Image
                        src={user.header_image}
                        alt="プロフィールヘッダー"
                        width={600}
                        height={200}
                        className="h-48 w-full object-cover"
                        priority
                    />

                    {/* プロフィール編集ボタンをヘッダーのすぐ下、右側に配置 */}
                    <div className="absolute top-56 right-4">
                        {currentUserId === user.firebaseuid ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-gray-300 text-gray-900 hover:bg-gray-100"
                                onClick={handleEditProfile}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                プロフィールを編集
                            </Button>
                        ) : (
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                size="sm"
                                className={`rounded-full ${
                                    isFollowing
                                        ? "border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-red-500 hover:border-red-500"
                                        : "bg-gray-900 text-white hover:bg-gray-800"
                                }`}
                                onClick={handleFollow}
                            >
                                {isFollowing ? (
                                    <>
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        フォロー中
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        フォロー
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <Image
                        src={user.icon_image}
                        alt={user.username || "ユーザーアイコン"}
                        width={120}
                        height={120}
                        className="absolute -bottom-16 left-4 h-32 w-32 rounded-full border-4 border-white"
                        priority
                    />
                </div>

                <div className="mt-20 px-4">
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-500">@{user.userid}</p>
                    <p className="mt-2">{user?.biography.String}</p>

                    <div className="mt-2 text-gray-500">
                        <Calendar size={16} className="mr-1 inline" />
                        {user?.created_at
                            ? (() => {
                                  const date = new Date(user.created_at);
                                  return isNaN(date.getTime())
                                      ? "登録日不明"
                                      : date.toLocaleDateString() + " に登録";
                              })()
                            : "登録日"}
                    </div>

                    <div className="mt-4 flex space-x-6 text-sm">
                        <div
                            className="flex items-center space-x-1 border-b border-transparent hover:border-black pb-0 leading-tight"
                            onClick={handleFollowCount}
                        >
                            <p className="font-bold ">{followCount}</p>
                            <p className="text-gray-500">フォロー中</p>
                        </div>
                        <div
                            className="flex items-center space-x-1 border-b border-transparent hover:border-black pb-0 leading-tight"
                            onClick={handleFollowCount}
                        >
                            <p className="font-bold">{followerCount}</p>
                            <p className="text-gray-500">フォロワー</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-b border-gray-200">
                    <nav className="flex">
                        <button className="flex-1  py-4 font-bold">
                            ポスト
                        </button>
                    </nav>
                </div>

                <div>
                    {tweets.map((data, index) => (
                        <TweetItem
                            key={index}
                            tweet={data.tweet}
                            user={data.user}
                            initialisLiked={data.isLiked}
                            initialisRetweeted={data.isRetweeted}
                            type={"tweet"}
                        />
                    ))}
                </div>
            </div>
            <TrendsSidebar />
        </div>
    );
}
