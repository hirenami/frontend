"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowData } from "@/types";
import { useState, useEffect } from "react";
import { UserCheck, UserX } from "lucide-react";

interface BlockProps {
    blocks: FollowData;
    index: number;
    token: string | null;
}

export default function Block({ blocks, index, token }: BlockProps) {
    const [isblock, setIsBlock] = useState(false);

    useEffect(() => {
        setIsBlock(blocks.isblock);
    }, [blocks.isblock]);

    const handleBlock = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(
                `https://backend-71857953091.us-central1.run.app/block/${blocks.user.userid}`,
                {
                    method: isblock ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                setIsBlock((prev) => !prev);
            } else {
                throw new Error("ブロックに失敗しました");
            }
        } catch (error) {
            console.error("ブロック中にエラーが発生しました:", error);
        }
    };

    const hundleUserClick = async () => {
        try {
            if (token) {
                window.location.href = `/profile/${blocks.user.userid}`; // ユーザーページへ遷移
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
                <AvatarImage src={blocks.user.icon_image} alt="@username" />
            </Avatar>
            <div className="ml-4 flex-1">
                <h2 className="font-bold">{blocks.user.username}</h2>
                <p className="text-sm text-muted-foreground">
                    @{blocks.user.userid}
                </p>
                {blocks.user.biography && blocks.user.biography !== '""' && (
                    <p className="text-sm text-muted-foreground">
                        {blocks.user.biography}
                    </p>
                )}
            </div>
            {/* フォローボタン */}

            <Button
                variant={isblock ? "outline" : "default"}
                size="sm"
                className={`rounded-full ${
                    isblock
                        ? "border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-red-500 hover:border-red-500"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                onClick={(e) => handleBlock(e)}
            >
                {isblock ? (
                    <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        ブロック中
                    </>
                ) : (
                    <>
                        <UserX className="h-4 w-4 mr-2" />
                        ブロックする
                    </>
                )}
            </Button>
        </div>
    );
}
