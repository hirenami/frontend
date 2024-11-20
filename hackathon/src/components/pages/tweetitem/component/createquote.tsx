import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { User } from "@/types";
import { useEffect, useRef, useState } from "react";
import {LucideImage} from "lucide-react";
import { uploadFile } from "@/features/firebase/strage";
import GetFetcher from "@/routes/getfetcher";

interface TweetComponentProps {
    tweetId: number;
	setRetweetCount: (retweetCount: number) => void;
	retweetCount: number;
	setIsQuoteDialogOpen: (isQuoteDialogOpen: boolean) => void;
}
const CreateTweet = ({  tweetId, setIsQuoteDialogOpen, setRetweetCount , retweetCount }: TweetComponentProps) => {
    const [tweetText, setTweetText] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態
	const { data: UserData,token } = GetFetcher('http://localhost:8080/user');
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

        const response = await fetch(`http://localhost:8080/retweet/${tweetId}/quote`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
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
            setIsQuoteDialogOpen(false)
			setRetweetCount(retweetCount + 1)
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

    return (
        <div className="border-b p-4">
            <div className="flex space-x-4">
               
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder={"コメントする"}
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
                                    : "コメントする"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTweet;
