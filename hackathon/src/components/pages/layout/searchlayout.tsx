// app/layout.tsx
import React, { ReactNode } from "react";
import Sidebar from "@/components/pages/layout/components/sidebar";
import GeminiSidebar from "@/components/pages/layout/components/gemini";
import MobileNavigation from "@/components/pages/layout/components/mobilesidebar";

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
			<MobileNavigation />
        </div>
    );
};

export default SearchLayout;
