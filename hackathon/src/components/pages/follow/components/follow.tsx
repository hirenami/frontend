"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowData, User } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import { useState, useEffect } from "react";
import { UserCheck, UserPlus } from "lucide-react";
import { handlekeyFollow } from "@/routes/profile/keyfollow";

interface FollowProps {
    follower: FollowData;
    index: number;
}

export default function Follow({ follower, index }: FollowProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isRequest, setIsRequest] = useState(false);
    const { data: UserData, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );

    useEffect(() => {
        if (UserData) {
            setUser(UserData.user);
        }
        setIsFollowing(follower.isfollows);
        setIsRequest(follower.isrequest);
    }, [follower.isfollows, UserData, follower.isrequest]);

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(
                `https://backend-71857953091.us-central1.run.app/follow/${follower.user.userid}`,
                {
                    method: isFollowing ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                setIsFollowing((prev) => !prev);
                console.log(isFollowing);
            } else {
                throw new Error("フォロー操作に失敗しました");
            }
        } catch (error) {
            console.error("フォロー操作中にエラーが発生しました:", error);
        }
    };

    const hundleUserClick = async () => {
        try {
            if (token) {
                window.location.href = `/profile/${follower.user.userid}`; // ユーザーページへ遷移
            }
        } catch (error) {
            console.error("ユーザーページへの遷移に失敗しました:", error);
        }
    };

    return (
        <div
            key={index}
            className="flex items-center p-4 border-b hover:bg-gray-100 transition-colors duration-200"
            onClick={hundleUserClick}
        >
            <Avatar className="w-12 h-12">
                <AvatarImage src={follower.user.icon_image} alt="@username" />
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="font-bold">
                    {follower.user.username}
                    {follower.user.isprivate ? "🔒️" : ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                    @{follower.user.userid}
                    {follower.isfollowers && (
                        <span className="bg-gray-200 text-gray-500 text-xs  ml-2 px-2 py-0.5">
                            フォローされています
                        </span>
                    )}
                </p>
                {follower.user.biography &&
                    follower.user.biography !== '""' && (
                        <p className="text-sm text-muted-foreground">
                            {follower.user.biography}
                        </p>
                    )}
            </div>
            {/* フォローボタン */}
            {follower.user.userid !== user?.userid && (
                <Button
                    variant={
                        isFollowing || (isRequest && follower?.isprivate)
                            ? "outline"
                            : "default"
                    }
                    size="sm"
                    className={`rounded-full ${
                        isFollowing || (isRequest && follower?.isprivate)
                            ? "border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-red-500 hover:border-red-500"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    onClick={
                        follower?.isprivate
                            ? (e) => {
                                  e.stopPropagation();
                                  handlekeyFollow(
                                      follower.user.userid,
                                      token,
                                      isRequest,
                                      setIsRequest
                                  );
                              }
                            : (e) => handleFollow(e)
                    }
                >
                    {isFollowing ? (
                        <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            フォロー中
                        </>
                    ) : follower?.isprivate ? (
                        <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {isRequest
                                ? "リクエスト済み"
                                : "フォローリクエスト"}
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
    );
}
