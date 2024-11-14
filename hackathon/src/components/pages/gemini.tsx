import React from "react";
import { Button } from "@/components/ui/button";
import {  Settings } from "lucide-react";


export default function GeminiSidebar() {
    return (
        <aside
            className="hidden lg:block fixed top-0 right-20 w-80 h-full"
            aria-label="gemini検索"
        >

            <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gemini</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="トレンド設定"
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                    
                </div>
            </div>
        </aside>
    );
}
