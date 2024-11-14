"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Tweet, User, TweetData } from "@/types";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TweetItem from "@/components/pages/tweet/components/tweetItems";
import CreateTweet from "@/components/pages/home/createTweet";
import GetFetcher from "@/routes/getfetcher";
import  Header  from "@/components/pages/tweet/components/header";
import TweetComponent from "@/components/pages/tweet/components/tweetcontent";
import ActionButton from "@/components/pages/tweet/components/actionbutton";

export default function TweetPage() {
    const { tweetId } = useParams();
    const tweetid = tweetId as unknown as number;
    const [isliked, setIsLiked] = useState<boolean>(false);
    const [likeData, setLikeData] = useState<number>(0);
    const [isretweet, setIsRetweet] = useState<boolean>(false);
    const [retweetCount, setRetweetCount] = useState<number>(0);
    const [retweet, setRetweet] = useState<TweetData | null>(null);
    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [replies, setReplies] = useState<TweetData[]>([]);
    const [replied, setReplied] = useState<TweetData[]>([]);
    const router = useRouter();
    const {
        data: tweetData,
        error: error1,
        isLoading: isLoading1,
        token,
    } = GetFetcher(`http://localhost:8080/tweet/${tweetid}/tweetid`);
    const {
        data: repliesData,
        error: error2,
        isLoading: isLoading2,
    } = GetFetcher(`http://localhost:8080/reply/${tweetId}`);
    const {
        data: repliedData,
        error: error3,
        isLoading: isLoading3,
    } = GetFetcher(`http://localhost:8080/reply/${tweetId}/replied`);
    const {
        data: retweetData,
        error: error4,
        isLoading: isLoading4,
    } = tweetData?.tweet?.retweetid
        ? GetFetcher(
              `http://localhost:8080/tweet/${tweetData.tweet.retweetid}/tweetid`
          )
        : { data: null, error: null , isLoading: false};

    useEffect(() => {
        if (!tweetId) return;

		if(tweetData) {

        setTweet(tweetData.tweet);
        setIsLiked(tweetData.likes);
        setLikeData(tweetData.tweet.likes);
        setIsRetweet(tweetData.retweets);
        setRetweetCount(tweetData.tweet.retweets);
        setUser(tweetData.user);
		}
		if(repliesData) {
        setReplies(repliesData);
		}
		if(repliedData) {
        setReplied(repliedData);
		}

        if (tweetData?.tweet.retweetid && retweetData) {
            setRetweet(retweetData);
        }
    }, [tweetId, tweetData, repliesData, repliedData, retweetData]);

	if (isLoading1 || isLoading2 || isLoading3 || isLoading4 || !tweet) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white text-black">
				<p>読み込み中...</p>
			</div>
		);
	}

	if (error1 || error2 || error3 || error4) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white text-black">
				<p>再読み込みしてください。</p>
			</div>
		);
	}

    const Tweetobj = () => {
        if (!tweet || !user) return null;
        return (
            <div className="flex space-x-3 flex-col p-2 border-b">
                {/* ユーザーのアイコン */}
               <Header user={user} token={token} />

                <div className="flex-1 min-w-0">
                    {/* ツイートの内容 */}
					<TweetComponent tweet={tweet} retweet={retweet}/>

                    {/* アクションボタン群 */}
					<ActionButton 
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
                    
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="sticky top-0 z-10 bg-white bg-opacity-80 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="mr-4 rounded-full p-2 hover:bg-gray-200"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">リプライする</h1>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                {replied &&
                    [...replied].reverse().map((data, index) => (
                        <TweetItem //type追加
                            key={index}
                            type={"reply"}
                            tweet={data.tweet}
                            user={data.user}
                            initialisLiked={data.likes}
                            initialisRetweeted={data.retweets}
                        />
                    ))}
            </div>
            {tweet ? (
                <div className="border-gray-200">
                    <Tweetobj />

                    <CreateTweet
                        userToken={token}
                        type={"reply"}
                        tweetId={tweetid}
                    />

                    <div>
                        {replies &&
                            replies.map((data, index) => (
                                <TweetItem
                                    key={index}
                                    tweet={data.tweet}
                                    user={data.user}
                                    initialisLiked={data.likes}
                                    initialisRetweeted={data.retweets}
                                    type={"tweet"}
                                />
                            ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 text-gray-500">読み込み中...</div>
            )}
        </>
    );
}
