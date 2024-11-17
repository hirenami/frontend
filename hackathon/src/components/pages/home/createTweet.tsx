import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/types";
import { useEffect, useRef, useState } from "react";
import {LucideImage} from "lucide-react";
import { uploadFile } from "@/features/firebase/strage";
import GetFetcher from "@/routes/getfetcher";

interface TweetComponentProps {
	userToken: string | null;
    type: string;
    tweetId: number;
}
const CreateTweet = ({ type, tweetId, userToken }: TweetComponentProps) => {
    const [tweetText, setTweetText] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態
	const { data: UserData } = GetFetcher('http://localhost:8080/user');
	const [user , setUser] = useState<User | null>(null);

    useEffect(() => {
		if (UserData) {
			setUser(UserData.user);
		}
		console.log(UserData);
	}, [UserData]);

    const handleTweet = async () => {
        if (tweetText.trim() === "" && !mediaFile) {
            alert("ツイートの内容を入力してください"); // 空のツイートの警告
            return;
        }

        setIsLoading(true); // ローディング開始
        let media_url = "";
		if ( tweetText == "") console.log("tweetText is empty");

        if (fileInputRef.current?.files?.[0]) {
            media_url = await uploadFile(fileInputRef.current.files[0]);
        }

        const endpoint =
            type === "tweet"
                ? "http://localhost:8080/tweet"
                : `http://localhost:8080/reply/${tweetId}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content:  tweetText,
                media_url: media_url,
            }),
        });

        if (response.ok) {
            console.log("ツイートが正常に投稿されました");
            setTweetText("");
            setMediaFile(null);
            router.push(
                type == "tweet"
                    ? `http://localhost:3000/home`
                    : `http://localhost:3000/tweet/${tweetId}`
            );
        } else {
            console.error("ツイートの投稿中にエラーが発生しました");
        }

        setIsLoading(false); // ローディング終了
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

    const router = useRouter();
    return (
        <div className="border-b p-4">
            <div className="flex space-x-4">
                <button
                    onClick={() => router.push(`/profile/${user?.userid}`)}
                    className="w-10 h-10"
                >
                    <Avatar className="w-full h-full">
                        <AvatarImage src={user?.icon_image} alt="@username" />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                </button>
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder={
                            type === "tweet"
                                ? "いまどうしてる？"
                                : "返信をツイート"
                        }
                        value={tweetText}
                        onChange={(e) => setTweetText(e.target.value)}
                        className="min-h-[100px] text-xl resize-none focus:ring-0 focus:border-transparent border-transparent p-0 shadow-none bg-transparent"
                        style={{
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                    />
                    {mediaFile && (
                        <div className="relative w-full h-60 bg-gray-200 rounded-xl overflow-hidden">
                            {mediaFile.type.startsWith("image/") ? (
                                <Image
                                    src={URL.createObjectURL(mediaFile)}
                                    alt="Uploaded media"
                                    className="w-full h-full object-cover"
                                    height={240}
                                    width={320}
                                />
                            ) : (
                                <video
                                    src={URL.createObjectURL(mediaFile)}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            )}
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setMediaFile(null)}
                            >
                                削除
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*,video/*"
                                className="hidden"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={triggerFileUpload}
                            >
                                <LucideImage className="h-5 w-5 text-primary" />
                            </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {user?.ispremium ?  "∞" : 140 - tweetText.length}
                            </span>
                            <Button
                                onClick={handleTweet}
                                disabled={
                                    isLoading ||
                                    (tweetText.length === 0 && !mediaFile) || (!user?.ispremium && tweetText.length > 140)
                                }
                                className="rounded-full px-4 py-2"
                            >
                                {isLoading
                                    ? "投稿中..."
                                    : type === "tweet"
                                    ? "ポストする"
                                    : "返信する"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTweet;
