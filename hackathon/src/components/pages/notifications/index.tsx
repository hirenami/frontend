"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import NotificationItem from "@/features/notification/notificationitem";
import { NotificationData } from "@/types";
import GetFetcher from "@/routes/getfetcher";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const { data, error, isLoading } = GetFetcher("http://localhost:8080/notifications");

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
        <>
            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold">通知</h1>
                <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                </Button>
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
        </>
    );
}
