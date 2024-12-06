import Image from "next/image";
import { RenderContentWithHashtags } from "@/lib/renderContentWithHashtags";
import { date } from "@/lib/Date";
import RetweetItem from "./retweetItems";
import { Tweet, TweetData } from "@/types";
import { useRouter } from "next/navigation";

interface TweetComponentProps {
    tweet: Tweet;
    retweet: TweetData | null;
    isblocked: boolean;
    isprivate: boolean;
}

export default function TweetComponent({
    tweet,
    retweet,
    isblocked,
    isprivate,
}: TweetComponentProps) {
    const router = useRouter();

    if (tweet.isdeleted) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50 text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    このツイートは、ツイートの制作者により削除されました。
                </p>
            </div>
        );
    }

    if (isblocked) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    ブロックされているため、このツイートは表示できません。
                </p>
            </div>
        );
    }
    if (isprivate) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md  text-gray-600">
                <p className="text-sm font-medium text-gray-800">
                    作成者が表示範囲を設定しているため、このツイートは表示できません。
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ツイートのテキスト */}
            <div className="w-full max-w-lg">
                <p className="text-sm text-gray-900 break-words">
                    {RenderContentWithHashtags(tweet.content)}
                </p>
            </div>

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
                <div
                    className="mt-3 mr-10 p-3 border border-gray-200 rounded-lg  hover:bg-gray-100"
                    onClick={() => router.push(`/tweet/${tweet.retweetid}`)}
                >
                    <RetweetItem
                        tweet={retweet.tweet}
                        isblocked={retweet.isblocked}
                        isprivate={retweet.isprivate}
                    />
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
