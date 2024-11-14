import Image from "next/image";
import { renderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import { date } from "@/lib/Date";
import RetweetItem from "./retweetItems";
import { Tweet, TweetData } from "@/types";

interface TweetComponentProps {
    tweet: Tweet;
    retweet: TweetData | null;
}

export default function TweetComponent({
    tweet,
    retweet,
}: TweetComponentProps) {
    return (
        <>
            {/* ツイートのテキスト */}
            <p className="text-lg text-gray-900 whitespace-pre-wrap">
                {renderContentWithHashtags(tweet.content)}
            </p>

            {/* メディア（画像または動画） */}
            {tweet.media_url && tweet.media_url !== '""' && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-[400px]">
                    {tweet.media_url.includes("images%") ? (
                        <Image
                            src={tweet.media_url}
                            alt="ツイート画像"
                            width={400}
                            height={225}
                            className="w-full h-auto object-cover max-h-[225px]"
                        />
                    ) : tweet.media_url.includes("videos%") ? (
                        <video
                            src={tweet.media_url}
                            controls
                            className="w-full h-auto object-cover max-h-[225px]"
                        >
                            お使いのブラウザは動画タグをサポートしていません。
                        </video>
                    ) : (
                        <p>サポートされていないメディアタイプです。</p>
                    )}
                </div>
            )}

            {/* 引用リツイートされたツイート */}
            {tweet.isquote && retweet && (
                <div className="mt-3 mr-10 p-3 border border-gray-200 rounded-lg  hover:bg-gray-100">
                    <RetweetItem tweet={retweet.tweet} />
                </div>
            )}

            {/* ツイートの日時 */}
            <div className="mt-3 text-gray-500 text-sm border-b border-gray p-2">
                {date(tweet.created_at)} ・<b>{tweet.impressions}</b>
                件の表示
            </div>
        </>
    );
}
