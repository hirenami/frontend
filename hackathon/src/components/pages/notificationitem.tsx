import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, UserPlus } from "lucide-react";
import { User,Notification,Tweet } from "@/types/index";

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

    const getIcon = () => {
        switch (notification.type) {
            case "reply":
                return <MessageCircle className="w-5 h-5 text-primary" />;
            case "like":
                return <Heart className="w-5 h-5 text-pink-500" />;
            case "retweet":
                return <Repeat className="w-5 h-5 text-green-500" />;
            case "follow":
                return <UserPlus className="w-5 h-5 text-primary" />;
        }
    };

    const getMessage = () => {
        switch (notification.type) {
            case "reply":
                return "返信しました";
            case "like":
                return "いいねしました";
            case "retweet":
                return "リツイートしました";
            case "follow":
                return "フォローしました";
        }
    };

    return (
        <div
            className={`flex items-start p-4 hover:bg-gray-50 ${
                notification.status=='unread' ? "bg-blue-50" : ""
            }`}
        >
            <div className="mr-4">{getIcon()}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                    <Avatar className="w-10 h-10 mr-2">
                        <AvatarImage src={user.icon_image} alt={user.username} />
                        <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                            @{user.userid}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-gray-700 mb-1">{getMessage()}</p>
                {notification.contentid.Valid && (
                    <p className="text-sm text-gray-600 mb-1">{tweet.content}</p>
                )}
                <p className="text-xs text-gray-500">{tweet.content}</p>
            </div>
        </div>
    );
};