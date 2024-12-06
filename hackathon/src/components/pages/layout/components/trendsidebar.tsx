import React from "react";
import GetFetcher from "@/routes/getfetcher";
import GeminiDetail from "./geminidetail";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const scrollbarHideStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function TrendsSidebar() {
    const { data } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/api/predict`
    );

    const router = useRouter();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // エンターキーが押された場合に検索処理を呼び出す
            if (e.key === "Enter") {
                if (e.nativeEvent.isComposing) {
                    // 日本語入力中（変換中）のエンターキーは抑制する
                    e.preventDefault();
                } else {
                    router.push(
                        `/search?q=${encodeURIComponent(
                            (e.target as HTMLInputElement).value
                        )}`
                    );
                }
            }
        }
    };

    return (
        <>
            <style jsx>{scrollbarHideStyles}</style>
            <aside
                className="hidden lg:block fixed top-0 right-20 w-80 h-screen overflow-hidden"
                aria-label="あなたへのおすすめ"
            >
                <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4">
                    <div className="p-4">
                        <div className="relative">
                            <div className="relative flex-1">
                                <input
                                    type="search"
                                    placeholder="検索"
                                    className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyDown={handleKeyPress}
                                />
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
                    <div className="p-6 flex-shrink-0">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    あなたへのおすすめ
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                        {data &&
                        data.productIds &&
                        data.productIds.length > 0 ? (
                            <div className="space-y-4">
                                {data.productIds
                                    .filter((item: any) => !!item) // 無効な値を除外
                                    .map((item: any) => (
                                        <div
                                            key={item}
                                            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                                        >
                                            <GeminiDetail
                                                id={item}
                                                index={item}
                                            />
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-center">
                                表示する商品がありません。
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
