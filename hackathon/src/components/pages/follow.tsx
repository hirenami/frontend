"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowData, User } from "@/types";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { UserCheck, UserPlus } from "lucide-react";
import { fireAuth } from "@/features/firebase/auth";

interface FollowProps {
    follower: FollowData;
    index: number;
}

export default function Follow({ follower, index }: FollowProps) {
    const [user, setUser] = useState<User | null>(null);
	const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            setUser(JSON.parse(userCookie) as User); // JSON文字列をオブジェクトに変換
        }
		setIsFollowing(follower.isfollows);
    }, [follower.isfollows]);

    const handleFollow = async () => {
        try {
            const token = await fireAuth.currentUser?.getIdToken();
            const response = await fetch(`http://localhost:8080/follow/${follower.user.userid}`, {
                method: follower.isfollows ? "DELETE" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
			if (response.ok) {
                setIsFollowing(!isFollowing);
                
            } else {
                throw new Error("フォロー操作に失敗しました");
			}
        } catch (error) {
            console.error("フォロー操作中にエラーが発生しました:", error);
        }
    };

    return (
        <div
            key={index}
            className="flex items-center p-4 border-b hover:bg-gray-100 transition-colors duration-200"
        >
            <Avatar className="w-12 h-12">
                <AvatarImage src={follower.user.icon_image} alt="@username" />
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="font-bold">{follower.user.username}</h2>
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
    );
}
