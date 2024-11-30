import { DmData, User, Dm } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { date } from "@/lib/Date";
import { CreateDM } from "@/routes/message/createdm";
import { LucideImage, X } from 'lucide-react';
import Image from "next/image";
import { uploadFile } from "@/features/firebase/strage";
import { GetDMs } from "@/routes/message/getmessage";

interface Props {
    dmdata: DmData | undefined;
    user: User | undefined;
    token: string | null;
}

export default function Detail({ dmdata, user, token }: Props) {
    const [messages, setMessages] = useState<Dm[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (dmdata) {
            const fetchData = async () => {
                const response = await GetDMs(token, dmdata.user.userid);
                if (response) {
                    setMessages(response);
                }
            }
            fetchData();
        }
    }, [dmdata, token]);

    const connectWebSocket = useCallback(() => {
        if (dmdata?.user.userid && user) {
            const ws = new WebSocket(`ws://localhost:8080/dm/${dmdata.user.userid}`);

            ws.onopen = () => {
                console.log("WebSocket接続が確立されました");
                setIsConnected(true);
                ws.send(JSON.stringify({ type: 'USER_INFO', userId: user.userid }));
            };

            ws.onmessage = (event) => {
                const newMessage = JSON.parse(event.data);
                if (newMessage.type === 'MESSAGE' && newMessage.receiverId === user.userid) {
                    setMessages((prevMessages) => {
                        const isDuplicate = prevMessages.some(
                            (msg) => msg.dmsid === newMessage.dmsid
                        );
                        if (!isDuplicate) {
                            return [...prevMessages, {
                                dmsid: newMessage.dmsid || Date.now(),
                                senderid: newMessage.senderId,
                                receiverid: newMessage.receiverId,
                                content: newMessage.content,
                                createdat: newMessage.createdat || new Date().toISOString(),
                                media_url: newMessage.media_url || "",
                                status: newMessage.status || "sent"
                            }];
                        }
                        return prevMessages;
                    });
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocketエラー:", error);
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log("WebSocket接続が閉じられました");
                setIsConnected(false);
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
            };

            setSocket(ws);

            return () => {
                ws.close();
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
            };
        }
    }, [dmdata?.user.userid, user]);

    useEffect(() => {
        connectWebSocket();

        const handleVisibilityChange = () => {
            if (!document.hidden && !isConnected) {
                connectWebSocket();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [connectWebSocket, isConnected]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();
        if ((inputMessage.trim() || mediaFile) && user) {
            let media_url = "";
            if (mediaFile) {
                media_url = await uploadFile(mediaFile);
            }

            const newMessage = {
                type: 'MESSAGE',
                dmsid: Date.now(),
                senderId: user.userid,
                receiverId: dmdata?.user.userid,
                content: inputMessage,
                createdat: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                media_url: media_url,
            };
            sendMessage(newMessage);
            CreateDM(token, dmdata?.user.userid, inputMessage, media_url);
            setInputMessage("");
            setMediaFile(null);
        }
    };

    const sendMessage = (message: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            connectWebSocket();
            setTimeout(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(message));
                } else {
                    console.error("メッセージを送信できませんでした。接続を確認してください。");
                }
            }, 1000);
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                dmsid: message.dmsid,
                senderid: message.senderId,
                receiverid: message.receiverId,
                content: message.content,
                createdat: message.createdat,
                media_url: message.media_url,
                status: "sent"
            }
        ]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const removeMediaFile = () => {
        setMediaFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!dmdata || !user) {
        return null;
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-4 font-bold text-xl border-b border-gray-200">
                {dmdata.user.username}
                <div className="text-sm font-normal text-gray-400">
                    {dmdata.user.userid}
                </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                {messages.map((dm) => (
					dm.content && (
                    <div
                        key={`${dm.dmsid}-${dm.createdat}`}
                        className={`mb-4 flex ${
                            dm.senderid === user.userid ? "justify-end" : "justify-start"
                        }`}
                    >
                        {dm.senderid !== user.userid && (
                            <Avatar className="h-10 w-10 mr-2">
                                <AvatarImage
                                    src={dmdata.user.icon_image}
                                    alt={dmdata.user.username}
                                />
                            </Avatar>
                        )}
                        <div
                            className={`max-w-[70%] ${
                                dm.senderid === user.userid ? "order-1" : "order-2"
                            }`}
                        >
                            {dm.media_url && (
                                <div className="mb-2">
                                    {dm.media_url.includes("images%") ? (
                                        <Image
                                            src={dm.media_url}
                                            alt="Attached media"
                                            width={200}
                                            height={200}
                                            className="rounded-lg"
                                        />
                                    ) : dm.media_url.includes("videos%") ? (
                                        <video
                                            src={dm.media_url}
                                            controls
                                            className="w-full max-w-[200px] rounded-lg"
                                        />
                                    ) : (
                                        <a href={dm.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            添付ファイルを表示
                                        </a>
                                    )}
                                </div>
                            )}
                            <div
                                className={`p-3 rounded-2xl ${
                                    dm.senderid === user.userid
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100"
                                }`}
                            >
                                {dm.content}
                            </div>
                            <div
                                className={`text-xs text-gray-500 mt-1 ${
                                    dm.senderid === user.userid ? "text-right" : "text-left"
                                }`}
                            >
                                {date(dm.createdat)}
                            </div>
                        </div>
                    </div>
					)
                ))}
            </ScrollArea>

            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
            >
                {mediaFile && (
                    <div className="mb-2 relative">
                        {mediaFile.type.startsWith('image/') ? (
                            <Image
                                src={URL.createObjectURL(mediaFile)}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="rounded-lg"
                            />
                        ) : mediaFile.type.startsWith('video/') ? (
                            <video
                                src={URL.createObjectURL(mediaFile)}
                                controls
                                className="w-full max-w-[200px] rounded-lg"
                            />
                        ) : (
                            <div className="p-2 bg-gray-100 rounded-lg">
                                {mediaFile.name}
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1"
                            onClick={removeMediaFile}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*,video/*"
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={triggerFileUpload}
                    >
                        <LucideImage className="h-5 w-5 text-primary" />
                    </Button>
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
    );
}

