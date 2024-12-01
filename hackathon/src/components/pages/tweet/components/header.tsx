import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Tweet } from "@/types";
import MenuComponent from "@/components/pages/tweet/components/menu";
import { Star } from "lucide-react";

interface HeaderProps {
    user: User | null;
    tweet: Tweet | null;
    token: string | null;
    isliked: boolean;
    setIsLiked: (isLiked: boolean) => void;
    likeData: number;
    setLikeData: (likeData: number) => void;
    isretweet: boolean;
    setIsRetweet: (isRetweet: boolean) => void;
    retweetCount: number;
    setRetweetCount: (retweetCount: number) => void;
}

export default function Header({
    user,
    tweet,
    token,
    isliked,
    setIsLiked,
    likeData,
    setLikeData,
    isretweet,
    setIsRetweet,
    retweetCount,
    setRetweetCount,
}: HeaderProps) {
    const hundleUserClick = async () => {
        try {
            if (token) {
                window.location.href = `/profile/${user?.userid}`; // ユーザーページへ遷移
            }
        } catch (error) {
            console.error("ユーザーページへの遷移に失敗しました:", error);
        }
    };

    if (!user || !tweet) {
        return null;
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex">
                <Button
                    className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
                    onClick={hundleUserClick}
                >
                    <Avatar className="w-full h-full rounded-full">
                        <AvatarImage
                            src={user?.icon_image}
                            alt={user?.userid}
                        />
                        <AvatarFallback>{user?.userid}</AvatarFallback>
                    </Avatar>
                </Button>

                {/* ツイートの内容 */}
                <div className="flex space-x-1 truncate flex-col ml-2">
                    {/* ユーザー名とID */}
                    <button
                        className="text-base font-bold text-gray-900 hover:underline bg-transparent p-0 focus:outline-none"
                        onClick={hundleUserClick}
                    >
                        {user?.username}
						{user?.isprivate ? "🔒️" : ""}
                    </button>
                    <button
                        className="text-sm text-gray-500 bg-transparent pr-6 focus:outline-none whitespace-nowrap"
                        onClick={hundleUserClick}
                    >
                        @{user?.userid}
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {/* 星のレビュー部分 */}
                {tweet.review > 0 && (
                    <div className="flex items-center space-x-1">
                        <span className="sr-only">
                            {tweet.review}つ星のレビュー
                        </span>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < tweet.review
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* メニューコンポーネント */}
                {tweet && (
                    <MenuComponent
                        tweet={tweet}
                        token={token}
                        isliked={isliked}
                        setIsLiked={setIsLiked}
                        likeData={likeData}
                        setLikeData={setLikeData}
                        isretweet={isretweet}
                        setIsRetweet={setIsRetweet}
                        retweetCount={retweetCount}
                        setRetweetCount={setRetweetCount}
                    />
                )}
            </div>
        </div>
    );
}
