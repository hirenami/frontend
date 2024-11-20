"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// ダミーデータ
const users = [
    {
        id: 1,
        name: "田中太郎",
        username: "@tanaka",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "こんにちは！",
    },
    {
        id: 2,
        name: "佐藤花子",
        username: "@sato",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "了解です。",
    },
    {
        id: 3,
        name: "鈴木一郎",
        username: "@suzuki",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "お疲れ様です。",
    },
    {
        id: 4,
        name: "田中太郎",
        username: "@tanaka",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "こんにちは！",
    },
    {
        id: 5,
        name: "佐藤花子",
        username: "@sato",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "了解です。",
    },
    {
        id: 6,
        name: "鈴木一郎",
        username: "@suzuki",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "お疲れ様です。",
    },
    {
        id: 7,
        name: "田中太郎",
        username: "@tanaka",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "こんにちは！",
    },
    {
        id: 8,
        name: "佐藤花子",
        username: "@sato",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "了解です。",
    },
    {
        id: 9,
        name: "鈴木一郎",
        username: "@suzuki",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "お疲れ様です。",
    },
    {
        id: 10,
        name: "田中太郎",
        username: "@tanaka",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "こんにちは！",
    },
    {
        id: 11,
        name: "佐藤花子",
        username: "@sato",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "了解です。",
    },
    {
        id: 12,
        name: "鈴木一郎",
        username: "@suzuki",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "お疲れ様です。",
    },
];

const messages = [
    {
        id: 1,
        userId: 1,
        text: "こんにちは!今日の会議について確認したいのですが、14時からで合っていますか？",
        sent: false,
        timestamp: "14:30",
    },
    {
        id: 2,
        userId: 0,
        text: "はい、その通りです。14時から会議室Aで行います。",
        sent: true,
        timestamp: "14:32",
    },
    {
        id: 3,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 4,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 5,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 6,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 7,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 8,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
    {
        id: 9,
        userId: 1,
        text: "ありがとうございます。では、そちらで。",
        sent: false,
        timestamp: "14:33",
    },
];

export default function DirectMessage() {
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [inputMessage, setInputMessage] = useState("");
    const router = useRouter();

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            console.log("メッセージを送信:", inputMessage);
            setInputMessage("");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white text-black">
            {/* ユーザー一覧 */}
            <div className="w-2/5 border-r border-gray-200">
                <div className="flex items-center w-full border-b p-4">
                    <button
                        className="rounded-full p-2 hover:bg-gray-200"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold ml-4">メッセージ</h1>
                </div>
                <ScrollArea className="h-[calc(100vh-80px)] overflow-y-auto">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                                selectedUser.id === user.id ? "bg-gray-100" : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-400">
                                    {user.username}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {user.lastMessage}
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* メッセージ画面 */}
            <div className="flex-1 flex flex-col ">
                <div className="p-4 font-bold text-xl border-b border-gray-200">
                    {selectedUser.name}
                    <div className="text-sm font-normal text-gray-400">
                        {selectedUser.username}
                    </div>
                </div>

                {/* メッセージ領域 */}
                <div className="flex-1 overflow-y-auto ">
                    <ScrollArea className="h-full p-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-4 flex ${
                                    message.sent
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                {!message.sent && (
                                    <Avatar className="h-10 w-10 mr-2">
                                        <AvatarImage
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                        />
                                        <AvatarFallback>
                                            {selectedUser.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={`max-w-[70%] ${
                                        message.sent ? "order-1" : "order-2"
                                    }`}
                                >
                                    <div
                                        className={`p-3 rounded-2xl ${
                                            message.sent
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                    <div
                                        className={`text-xs text-gray-500 mt-1 ${
                                            message.sent
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                    >
                                        {message.timestamp}
                                    </div>
                                </div>
                                {message.sent}
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* メッセージ入力フォーム */}
                <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-200 flex-shrink-0 bg-white"
                >
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="メッセージを入力..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="flex-1 bg-gray-50 border-gray-300 text-black"
                        />
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            送信
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
