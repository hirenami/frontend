"use client";

import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import TweetItem from "@/components/pages/tweetitem";
import { TweetData, ListingItem, FollowData } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetweetItem from "../tweet/components/retweetItems";
import { UserX, LockIcon } from "lucide-react";

export default function ProfilePage() {
    const { userId } = useParams();
    const router = useRouter();
    const userid = userId as string;
    const [user, setUser] = useState<FollowData | null>(null);
    const [tweets, setTweets] = useState<TweetData[]>([]);
    const [replies, setReplies] = useState<TweetData[]>([]);
    const [likes, setLikes] = useState<TweetData[]>([]);
    const [listings, setListings] = useState<ListingItem[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const { data: userData } = GetFetcher(
        `http://localhost:8080/user/${userid}`
    );
    const { data: tweetData, token } = GetFetcher(
        `http://localhost:8080/tweet/${userid}`
    );
    const { data: myData } = GetFetcher("http://localhost:8080/user");
    const { data: replyData } = GetFetcher(
        `http://localhost:8080/reply/${userid}/user`
    );
    const { data: likeData } = GetFetcher(
        `http://localhost:8080/like/${userid}`
    );
    const { data: listingData } = GetFetcher(
        `http://localhost:8080/listing/${userid}/userid`
    );

    useEffect(() => {
        if (myData) {
            setCurrentUserId(myData.user.firebaseuid);
        }
        if (userData) {
            setUser(userData);
        }
        if (tweetData) {
            setTweets(tweetData);
        }
        if (replyData) {
            setReplies(replyData);
        }
        if (likeData) {
            setLikes(likeData);
        }
        if (listingData) {
            setListings(listingData);
        }
    }, [userData, tweetData, myData, replyData, likeData, listingData]);

    return (
        <>
            <Header
                userData={user}
                currentUserId={currentUserId}
                userid={userid}
                tweets={tweets}
                token={token}
            />

            {user?.isblocked ? (
                <div className="flex flex-col items-center justify-center space-y-2 p-8 rounded-lg mt-10">
                    <UserX className="w-12 h-12 text-gray-400" />
                    <span className="font-bold text-xl text-gray-900">
                        {user?.user.username}さんにブロックされています
                    </span>
                    <p className="text-gray-600">
                        このアカウントのツイートは表示できません
                    </p>
                </div>
            ) : user?.isprivate ? (
                <div className="flex flex-col items-center justify-center space-y-2 p-8 rounded-lg mt-10">
                    <LockIcon className="w-12 h-12 text-gray-400" />
                    <span className="font-bold text-xl text-gray-900">
                        {user?.user.username}さんのツイートは非公開です
                    </span>
                    <p className="text-gray-600">
                        フォローリクエストを送信してツイートを見る
                    </p>
                </div>
            ) : (
                <Tabs defaultValue="posts" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-4 bg-white">
                        <TabsTrigger
                            value="posts"
                            className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none font-bold"
                        >
                            ツイート
                        </TabsTrigger>
                        <TabsTrigger
                            value="replies"
                            className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none font-bold"
                        >
                            返信
                        </TabsTrigger>
                        <TabsTrigger
                            value="likes"
                            className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none font-bold"
                        >
                            いいね
                        </TabsTrigger>
                        <TabsTrigger
                            value="listings"
                            className="hover:bg-gray-100 data-[state=active]:border-blue-500 data-[state=active]:border-b-2 rounded-none font-bold"
                        >
                            出品情報
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts">
                        {tweets.map((data, index) => (
                            <TweetItem
                                key={index}
                                tweet={data.tweet}
                                user={data.user}
                                initialisLiked={data.likes}
                                initialisRetweeted={data.retweets}
                                type={"tweet"}
                                isblocked={data.isblocked}
                                isprivate={data.isprivate}
                                token={token}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="replies">
                        {replies.map((data, index) => (
                            <TweetItem
                                key={index}
                                tweet={data.tweet}
                                user={data.user}
                                initialisLiked={data.likes}
                                initialisRetweeted={data.retweets}
                                type={"tweet"}
                                isblocked={data.isblocked}
                                isprivate={data.isprivate}
                                token={token}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="likes">
                        {likes.map((data, index) => (
                            <TweetItem
                                key={index}
                                tweet={data.tweet}
                                user={data.user}
                                initialisLiked={data.likes}
                                initialisRetweeted={data.retweets}
                                type={"tweet"}
                                isblocked={data.isblocked}
                                isprivate={data.isprivate}
                                token={token}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="listings">
                        {listings.map((listing, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-300 p-6  bg-white hover:bg-gray-50"
                                onClick={() =>
                                    router.push(
                                        `/purchase/${listing.tweet.tweetid}`
                                    )
                                }
                            >
                                <h3 className="font-bold text-lg text-gray-800 mb-2">
                                    商品名：{listing.listing.listingname}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    商品説明：
                                    {listing.listing.listingdescription}
                                </p>
                                <p className="text-gray-500 mb-4">
                                    価格：
                                    <span className="text-gray-800 font-semibold">
                                        ¥{listing.listing.listingprice}
                                    </span>
                                </p>
                                <div
                                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                            `/tweet/${listing.tweet.tweetid}`
                                        );
                                    }}
                                >
                                    <RetweetItem
                                        tweet={listing.tweet}
                                        isblocked={false}
                                        isprivate={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            )}
        </>
    );
}
