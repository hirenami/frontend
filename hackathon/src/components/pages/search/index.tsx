"use client";

import { useState, useEffect, Suspense } from "react";
import GetFetcher from "@/routes/getfetcher";
import TweetItem from "@/components/pages/tweet/tweetItems";
import { TweetData } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Settings2 } from "lucide-react";

const SearchPage = () => {
  const [searchData, setSearchData] = useState<TweetData[]>([]);
  const router = useRouter();
  const q = useSearchParams().get("q"); // search paramsはSuspense外で使う

  const { data: search, error, isLoading } = GetFetcher(
    `http://localhost:8080/search/${q}`
  );

  useEffect(() => {
    if (search) {
      setSearchData(search);
    }
  }, [search]);

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

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
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

      {/* Suspenseはデータの取得にのみ使用 */}
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          {searchData.map((data, index) => (
            <TweetItem
              key={index}
              type={"tweet"}
              tweet={data.tweet}
              user={data.user}
              initialisLiked={data.likes}
              initialisRetweeted={data.retweets}
            />
          ))}
        </div>
      </Suspense>
    </>
  );
};

export default SearchPage;