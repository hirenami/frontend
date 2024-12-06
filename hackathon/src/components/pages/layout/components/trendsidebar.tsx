import React from "react";
import GetFetcher from "@/routes/getfetcher";
import GeminiDetail from "./geminidetail";
import { Sparkles } from "lucide-react";

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

    const { data } = GetFetcher( `https://backend-71857953091.us-central1.run.app/api/predict`)
   

    return (
        <>
            <style jsx>{scrollbarHideStyles}</style>
            <aside
                className="hidden lg:block fixed top-0 right-20 w-80 h-screen overflow-hidden"
                aria-label="あなたへのおすすめ"
            >
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

                        {data && data.productIds && data.productIds.length > 0 && (
                            <div className="space-y-4">
                                {data.productIds.map((item: any) => (
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
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
