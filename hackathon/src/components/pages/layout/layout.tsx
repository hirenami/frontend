// app/layout.tsx
import React, { ReactNode } from "react";
import Sidebar from "@/components/pages/layout/components/sidebar";
import TrendsSidebar from "@/components/pages/layout/components/trendsidebar";
import MobileNavigation from "@/components/pages/layout/components/mobilesidebar";

interface LayoutProps {
    children: ReactNode; // childrenの型をReactNodeに指定
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-80 mr-0 md:mr-120 border-r border-l pb-16">
                {children} {/* 動的にレンダリングするコンテンツ */}
            </main>
            <TrendsSidebar />
			<MobileNavigation />
        </div>
    );
};

export default Layout;
