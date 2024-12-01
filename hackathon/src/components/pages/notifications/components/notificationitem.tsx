import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, UserPlus, MessagesSquare } from "lucide-react";
import { User,Notification,Tweet } from "@/types/index";
import { onAuthStateChanged } from "firebase/auth";
import {fireAuth} from "@/features/firebase/auth";
import { updateNotificationStatus } from "@/features/notification/updateNotificationStatus";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
    notification: Notification;
	user: User;
	tweet: Tweet;
}

export default function NotificationItem({
   notification,
   user,
   tweet
}: NotificationItemProps) {
	const auth = fireAuth;
	const [userToken, setUserToken] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const handleAuthChange = () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken();
					setUserToken(token);
                } else {
                    console.error("ユーザーがログインしていません");
                }
            });
            return unsubscribe;
        };
        handleAuthChange();
    }, [auth, tweet]);

    const getIcon = () => {
        switch (notification.type) {
            case "reply":
                return <MessageCircle className="w-5 h-5 text-primary" />;
            case "like":
                return <Heart className="w-5 h-5 text-pink-500" />;
            case "retweet":
                return <Repeat className="w-5 h-5 text-green-500" />;
			case "quote":
				return <Repeat className="w-5 h-5 text-green-500" />;
            case "follow":
                return <UserPlus className="w-5 h-5 text-primary" />;
			case "dm":
				return <MessagesSquare className="w-5 h-5 text-primary" />;
			case "keyfollow":
				return <UserPlus className="w-5 h-5 text-primary" />;
        }
    };

    const getMessage = () => {
        switch (notification.type) {
            case "reply":
                return `さんがあなたの投稿に返信しました`;
            case "like":
                return `さんがあなたの投稿をいいねしました`;
            case "retweet":
                return `さんがあなたの投稿をリツイートしました`;
			case "quote":
				return `さんがあなたの投稿を引用リツイートしました`;
            case "follow":
                return `さんがあなたをフォローしました`;
			case "dm":
				return `さんがあなたにDMを送りました`;
			case "keyfollow":
				return `さんがあなたにフォローリクエストを送りました`;
        }
    };

	const handleNotificationClick = () => {
		if (userToken) {
			console.log("Notification Clicked:", notification.notificationsid);
			updateNotificationStatus(userToken, notification.notificationsid);
		}
		if (notification.type === "dm") {
			router.push(`/message`);
		}else if (notification.contentid) {
			router.push(`/tweet/${notification.contentid}`);
		}else{
			router.push(`/profile/${user.userid}`);
		}

	}

    return (
		<div className="flex items-start p-4 hover:bg-gray-50 border-b relative" onClick={handleNotificationClick}>
			<div className="mr-4">
				{getIcon()}
				{/* 未読の場合、右上に青い◯を表示 */}
				{notification.status === 'unread' && (
					<div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center mb-1">
					<Avatar className="w-8 h-8 mr-2">
						<AvatarImage src={user.icon_image} alt={user.username} />
					</Avatar>
				</div>
				<p className="text-gray-700 mb-1"><b>{user.username}</b>{getMessage()}</p>
				{notification.contentid!=0 && (
					<p className="text-sm text-gray-600 mb-1">{tweet.content}</p>
				)}
			</div>
		</div>
	);
	
};