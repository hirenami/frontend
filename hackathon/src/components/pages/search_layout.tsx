// app/layout.tsx
import React, { ReactNode } from "react";
import Sidebar from "@/components/pages/sidebar";
import GeminiSidebar from "@/components/pages/gemini";

interface LayoutProps {
    children: ReactNode; // childrenの型をReactNodeに指定
}

const SearchLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-80 mr-120 border-r border-l">
                {children} {/* 動的にレンダリングするコンテンツ */}
            </main>
            <GeminiSidebar />
        </div>
    );
};

export default SearchLayout;