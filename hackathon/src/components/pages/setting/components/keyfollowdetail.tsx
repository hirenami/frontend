"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowData } from "@/types";
import { UserCheck, UserX } from "lucide-react";
import { useState } from "react";

interface followProps {
    follows: FollowData;
    index: number;
    token: string | null;
}

export default function Follow({ follows, index, token }: followProps) {
    const [isclick, setIsClick] = useState<boolean>(false);

    const approvefollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(
                `https://backend-71857953091.us-central1.run.app/keyfollow/${follows.user.userid}/approve`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                setIsClick(true);
            } else {
                throw new Error("フォローに失敗しました");
            }
        } catch (error) {
            console.error("フォロー中にエラーが発生しました:", error);
        }
    };

    const rejectfollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(
                `https://backend-71857953091.us-central1.run.app/keyfollow/${follows.user.userid}/reject`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                setIsClick(true);
            } else {
                throw new Error("フォローに失敗しました");
            }
        } catch (error) {
            console.error("フォロー中にエラーが発生しました:", error);
        }
    };

    const hundleUserClick = async () => {
        try {
            if (token) {
                window.location.href = `/profile/${follows.user.userid}`; // ユーザーページへ遷移
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
                <AvatarImage src={follows.user.icon_image} alt="@username" />
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="font-bold">{follows.user.username}</h2>
                <p className="text-sm text-muted-foreground">
                    @{follows.user.userid}
                </p>
                {follows.user.biography && follows.user.biography !== '""' && (
                    <p className="text-sm text-muted-foreground">
                        {follows.user.biography}
                    </p>
                )}
            </div>
            {/* フォローボタン */}

            {!isclick && (
                <>
                    <Button
                        variant={"outline"}
                        size="sm"
                        className="rounded-full border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-red-500 hover:border-red-500"
                        onClick={(e) => rejectfollow(e)}
                    >
                        <UserX className="h-4 w-4 mr-2" />
                        承認しない
                    </Button>

                    <Button
                        variant={"default"}
                        size="sm"
                        className="rounded-full bg-gray-900 text-white hover:bg-gray-800 ml-2"
                        onClick={(e) => approvefollow(e)}
                    >
                        <UserCheck className="h-4 w-4 mr-2" />
                        承認する
                    </Button>
                </>
            )}
        </div>
    );
}
