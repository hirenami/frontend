"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Image as LucideImage,
    FileVideo,
    BarChart2,
    Smile,
    CalendarClock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { uploadFile } from "@/features/firebase/strage";
import Image from "next/image";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { Tweet, User } from "@/types";
import { fetchTimeline } from "@/features/tweet/fetchTimeline";
import Cookies from "js-cookie";
import Sidebar from "@/components/pages/sidebar";
import TweetItem from "@/components/pages/tweetItems";

export default function Component() {
    const router = useRouter();
    const [tweetText, setTweetText] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [timelineData, setTimelineData] = useState<Tweet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態
    const auth = getAuth();
    // クッキーからユーザー情報;を取得
    const userCookie = Cookies.get("user");
    let user: User | null = null;

    if (userCookie) {
        user = JSON.parse(userCookie) as User; // JSON文字列をオブジェクトに変換
    }

    useEffect(() => {
        const handleAuthChange = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
                    setUserToken(token);
                    setTimelineData(await fetchTimeline(token));
                } else {
                    console.log("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
    }, [auth]);

    const handleTweet = async () => {
        if (tweetText.trim() === "" && !mediaFile) {
            alert("ツイートの内容を入力してください"); // 空のツイートの警告
            return;
        }

        setIsLoading(true); // ローディング開始
        let media_url = null;

        if (fileInputRef.current?.files?.[0]) {
            media_url = await uploadFile(fileInputRef.current.files[0]);
        }

        const response = await fetch("http://localhost:8000/tweet", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: tweetText,
                media_url: media_url,
            }),
        });

        if (response.ok) {
            console.log("ツイートが正常に投稿されました");
            setTweetText("");
            setMediaFile(null);
            router.push(`http://localhost:3000/home`);
        } else {
            console.error("ツイートの投稿中にエラーが発生しました");
        }

        setIsLoading(false); // ローディング終了
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

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

                <div className="border-b p-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() =>
                                router.push(`/profile/${user?.userid}`)
                            }
                            className="w-10 h-10"
                        >
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src={user?.icon_image}
                                    alt="@username"
                                />
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                        </button>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="いまどうしてる？"
                                value={tweetText}
                                onChange={(e) => setTweetText(e.target.value)}
                                className="min-h-[100px] text-xl resize-none focus:ring-0 focus:border-transparent border-transparent p-0 shadow-none bg-transparent"
                                style={{
                                    border: "none",
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                            />
                            {mediaFile && (
                                <div className="relative w-full h-60 bg-gray-200 rounded-xl overflow-hidden">
                                    {mediaFile.type.startsWith("image/") ? (
                                        <Image
                                            src={URL.createObjectURL(mediaFile)}
                                            alt="Uploaded media"
                                            className="w-full h-full object-cover"
                                            height={240}
                                            width={320}
                                        />
                                    ) : (
                                        <video
                                            src={URL.createObjectURL(mediaFile)}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => setMediaFile(null)}
                                    >
                                        削除
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex space-x-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*,video/*"
                                        className="hidden"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={triggerFileUpload}
                                    >
                                        <LucideImage className="h-5 w-5 text-primary" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <FileVideo className="h-5 w-5 text-primary" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <BarChart2 className="h-5 w-5 text-primary" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Smile className="h-5 w-5 text-primary" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <CalendarClock className="h-5 w-5 text-primary" />
                                    </Button>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">
                                        {140 - tweetText.length}
                                    </span>
                                    <Button
                                        onClick={handleTweet}
                                        disabled={
                                            isLoading ||
                                            (tweetText.length === 0 &&
                                                !mediaFile)
                                        }
                                        className="rounded-full px-4 py-2"
                                    >
                                        {isLoading ? "投稿中..." : "ポストする"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {timelineData.map((tweet) => (
                        <TweetItem key={tweet.tweetid} tweet={tweet} />
                    ))}
                </div>
            </main>

            <TrendsSidebar />
        </div>
    );
}
