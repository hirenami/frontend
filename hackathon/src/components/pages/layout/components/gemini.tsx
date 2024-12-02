import React from "react";
import GetFetcher from "@/routes/getfetcher";
import { useSearchParams } from "next/navigation";
import GeminiDetail from "./geminidetail";
import { Sparkles, AlertCircle } from "lucide-react";

const scrollbarHideStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function GeminiSidebar() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    const { data } = GetFetcher(
        q
            ? `https://backend-71857953091.us-central1.run.app/api/search-products/${q}`
            : ""
    );

    return (
        <>
            <style jsx>{scrollbarHideStyles}</style>
            <aside
                className="hidden lg:block fixed top-0 right-20 w-80 h-screen overflow-hidden"
                aria-label="Vertex AI検索"
            >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
                    <div className="p-6 flex-shrink-0">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Vertex AI検索
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                        {q &&
                        data &&
                        data.results &&
                        data.results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <AlertCircle className="w-12 h-12 mb-4" />
                                <p className="text-center">
                                    「{q}
                                    」に一致する検索結果が見つかりませんでした。
                                </p>
                                <p className="text-sm mt-2">
                                    別のキーワードで試してみてください。
                                </p>
                            </div>
                        ) : null}

                        {data && data.results && data.results.length > 0 && (
                            <div className="space-y-4">
                                {data.results.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <GeminiDetail
                                            id={item.id}
                                            index={item.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
