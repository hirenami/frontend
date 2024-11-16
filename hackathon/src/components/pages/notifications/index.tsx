"use client";

import React, { useEffect, useState } from "react";
import NotificationItem from "@/components/pages/notifications/components/notificationitem";
import { NotificationData } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const { data, error, isLoading } = GetFetcher("http://localhost:8080/notifications");
	const router = useRouter();

    useEffect(() => {
        if (data) {
            setNotifications(data);
        }
    }, [data]); 

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>再読み込みしてください</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center w-full border-b pb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">通知</h1>
            </div>
            <div className="overflow-y-auto">
                {notifications.slice(0, 10).map((data, index) => (
                    <NotificationItem
                        key={index}
                        notification={data.notification}
                        user={data.user}
                        tweet={data.tweet}
                    />
                ))}
            </div>
        </div>
    );
}
