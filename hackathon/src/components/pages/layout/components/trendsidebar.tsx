import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrendItem {
    topic: string;
    tweetCount: number;
    category: string;
}

const trendItems: TrendItem[] = [
    { topic: "東京オリンピック", tweetCount: 335000, category: "スポーツ" },
    {
        topic: "#プログラミング学習",
        tweetCount: 128080,
        category: "テクノロジー",
    },
    { topic: "新型コロナウイルス", tweetCount: 892000, category: "ニュース" },
    { topic: "新作映画", tweetCount: 56000, category: "エンターテイメント" },
    { topic: "SDGs", tweetCount: 223000, category: "環境" },
];

export default function TrendsSidebar() {
    const router = useRouter();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // エンターキーが押された場合に検索処理を呼び出す
            if (e.key === "Enter") {
                if (e.nativeEvent.isComposing) {
                    // 日本語入力中（変換中）のエンターキーは抑制する
                    e.preventDefault();
                } else {
					router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
            }
        }
    };

    return (
        <aside
            className="hidden lg:block fixed top-0 right-20 w-80 h-full"
            aria-label="トレンドサイドバー"
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

            <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">トレンド</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="トレンド設定"
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                    <ul>
                        {trendItems.map((item, index) => (
                            <li key={index} className="mb-4 last:mb-0">
                                <a
                                    href="#"
                                    className="block hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
                                >
                                    <div className="flex justify-between items-start text-sm text-gray-500">
                                        <span>{item.category}・トレンド</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-400 hover:text-primary hover:bg-primary/10"
                                        >
                                            <span className="sr-only">
                                                その他のオプション
                                            </span>
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                className="h-5 w-5 fill-current"
                                            >
                                                <g>
                                                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                                                </g>
                                            </svg>
                                        </Button>
                                    </div>
                                    <p className="font-bold text-base mt-1">
                                        {item.topic}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.tweetCount.toLocaleString()}
                                        件のツイート
                                    </p>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <Button variant="link" className="text-primary mt-2">
                        さらに表示
                    </Button>
                </div>
            </div>
        </aside>
    );
}
