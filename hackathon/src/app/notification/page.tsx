"use client";

import React, { useEffect,useState } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/pages/sidebar";
import TrendsSidebar from "@/components/pages/trendsidebar";
import { Bell } from "lucide-react";
import  NotificationItem  from "@/components/pages/notificationitem";
import { NotificationData } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { fetchNotificationData } from "@/features/notification/fetchNotifications";
import { combineNotificationDatas } from "@/lib/combineNotificationData";




export default function NotificationsPage() {
	const auth = fireAuth;
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<NotificationData[]>([]);
	 
	useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                try {
					const data = await fetchNotificationData(token);
					setNotifications(combineNotificationDatas(data));
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
    }, [auth]);


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p>読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 ml-80 mr-120 border-r border-l">
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-bold">通知</h1>
                    <Button variant="ghost" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
                <div className="h-[calc(100vh-120px)]">
                    {notifications.slice(0, 10).map((data,index) => (
                        <NotificationItem
                            key={index}
                            notification={data.notification}
							user={data.user}
							tweet={data.tweet}
                        />
                    ))}
                </div>
            </div>
            <TrendsSidebar />
        </div>
    );
}
