"use client";

import { useState, useEffect } from "react";
import GetFetcher from "@/routes/getfetcher";
import TweetItem from "@/components/pages/tweetitem";
import Follow from "@/components/pages/follow/components/follow";
import { TweetData, FollowData } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchPage = () => {
    const [searchData, setSearchData] = useState<TweetData[]>([]);
    const [userData, setUserData] = useState<FollowData[]>([]);
    const [hashtagData, setHashtagData] = useState<TweetData[]>([]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const hashtag = q.startsWith("#") ? q.replace(/^(#|＃)/, "") : q;

	// エンコードされた hashtag を作成
	const encodedHashtag = encodeURIComponent(hashtag).replace(/\//g, "%2F");

    const {
        data: search,
        error,
        isLoading,
        token,
    } = GetFetcher(
        q
            ? `https://backend-71857953091.us-central1.run.app/search/${encodedHashtag}`
            : ""
    );

    const { data: user } = GetFetcher(
        q
            ? `https://backend-71857953091.us-central1.run.app/search/${encodedHashtag}/user`
            : ""
    );

    const { data: Hashtag } = GetFetcher(
        hashtag
            ? `https://backend-71857953091.us-central1.run.app/search/＃${encodedHashtag}/hashtag`
            : ""
    );

    useEffect(() => {
        setSearchData([]);
        setUserData([]);
        setHashtagData([]);

        if (search) {
            setSearchData(search);
        }
        if (user) {
            setUserData(user);
        }
        if (Hashtag) {
            setHashtagData(Hashtag);
        }
        console.log(q);
    }, [search, user, Hashtag, q]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            const query = (e.target as HTMLInputElement).value;
            const encode = encodeURIComponent(query);
            router.push(`/search?q=${encode}`);
        }
    };

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

    const displayData = q.startsWith("#") ? hashtagData : searchData;

    return (
        <>
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-4 p-4">
                    <button
                        onClick={() => router.push("/home")}
                        className="rounded-full p-2 hover:bg-gray-200"
                        aria-label="戻る"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="search"
                            placeholder="検索"
                            className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={handleKeyPress}
                            defaultValue={q}
                        />
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                        className="rounded-full p-2 hover:bg-gray-200"
                        aria-label="設定"
                    >
                        <Settings2 size={20} />
                    </button>
                </div>
            </header>
            <Tabs defaultValue="tweets" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger
                        value="tweets"
                        className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none"
                    >
                        ツイート
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none"
                    >
                        ユーザー
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="tweets">
                    {displayData?.length === 0 ? (
                        <div className="flex items-center justify-center bg-white text-black pt-20">
                            <p>該当するツイートが見つかりませんでした</p>
                        </div>
                    ) : (
                        <div>
                            {displayData?.map((data, index) => (
                                <TweetItem
                                    key={index}
                                    type={"tweet"}
                                    tweet={data.tweet}
                                    user={data.user}
                                    retweet={data.retweet}
                                    initialisLiked={data.likes}
                                    initialisRetweeted={data.retweets}
                                    isblocked={data.isblocked}
                                    isprivate={data.isprivate}
                                    token={token}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="users">
                    {userData?.length === 0 ? (
                        <div className="flex items-center justify-center bg-white text-black pt-20">
                            <p>該当するユーザーが見つかりませんでした</p>
                        </div>
                    ) : (
                        <div>
                            {userData?.map((data, index) => (
                                <Follow
                                    key={index}
                                    index={index}
                                    follower={data}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </>
    );
};

export default SearchPage;
