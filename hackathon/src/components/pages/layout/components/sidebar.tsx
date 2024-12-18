"use client";

import { Button } from "@/components/ui/button";
import {
    Bell,
    Home,
    LogOut,
    Mail,
    Search,
    User as UserIcon,
    ShoppingCart,
    Upload,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MoreHorizontal, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GetFetcher from "@/routes/getfetcher";
import { User } from "@/types/index";
import Listing from "@/components/pages/layout/components/listing";

const Sidebar = () => {
    const router = useRouter();
    const currentPath = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const { data: UserData } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );

    useEffect(() => {
        if (UserData) {
            setUser(UserData.user);
        }
    }, [UserData]);

    const signOutEmailAndPassword = async (): Promise<void> => {
		try {
			await signOut(fireAuth); // 確実にログアウト処理が完了するまで待つ
			alert("ログアウトしました");
			router.replace("/"); // リダイレクト
		} catch (err) {
			console.error("ログアウトに失敗しました:", err);
			alert("ログアウトに失敗しました。再試行してください。");
		}
	};

    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className="w-80 p-4 flex flex-col fixed min-h-screen hidden md:flex">
            <div className="mb-8 ml-6" onClick={() => router.push("/home")}>
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/term6-namito-hirezaki.appspot.com/o/%E6%AE%B5%E8%90%BD%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88.png?alt=media&token=30c714d3-8dae-4d91-8c83-77fa1fae733e"
                    alt="logo"
                    width={100}
                    height={100}
                />
            </div>

            <nav className="space-y-2">
                <Button
                    onClick={() => router.push("/home")}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath === "/home" ? "font-bold" : ""
                    }`}
                >
                    <Home className="mr-4 h-6 w-6" />
                    ホーム
                </Button>
                <Button
                    onClick={() => router.push("/search")}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath === "/search" ? "font-bold" : ""
                    }`}
                >
                    <Search className="mr-4 h-6 w-6" />
                    検索
                </Button>
                <Button
                    onClick={() => router.push("/notification")}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath === "/notification" ? "font-bold" : ""
                    }`}
                >
                    <Bell className="mr-4 h-6 w-6" />
                    通知
                </Button>
                <Button
                    onClick={() => router.push("/message")}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath === "/message" ? "font-bold" : ""
                    }`}
                >
                    <Mail className="mr-4 h-6 w-6" />
                    メッセージ
                </Button>
                <Button
                    onClick={() => router.push(`/setting`)}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath === "/setting" ? "font-bold" : ""
                    }`}
                >
                    <Settings className="mr-4 h-6 w-6" />
                    設定
                </Button>
                <Button
                    onClick={() => router.push(`/profile/${user?.userid}`)}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath.startsWith("/profile/") ? "font-bold" : ""
                    }`}
                >
                    <UserIcon className="mr-4 h-6 w-6" />
                    プロフィール
                </Button>
                <Button
                    onClick={() => router.push(`/purchaselist`)}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath.startsWith("/purchaselist")
                            ? "font-bold"
                            : ""
                    }`}
                >
                    <ShoppingCart className="mr-4 h-6 w-6" />
                    購入情報
                </Button>
                <Button
                    onClick={() => router.push(`/listing`)}
                    variant="ghost"
                    size="lg"
                    className={`w-full justify-start text-lg ${
                        currentPath.startsWith("/listing") ? "font-bold" : ""
                    }`}
                >
                    <Upload className="mr-4 h-6 w-6" />
                    出品情報
                </Button>
            </nav>
            <Listing />

            <div className="mt-auto">
                {user && (
                    <div className="flex items-center justify-between p-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors duration-200 cursor-pointer">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                {user.icon_image ? (
                                    <Image
                                        src={user.icon_image}
                                        alt={
                                            user.username || "ユーザーアイコン"
                                        }
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-2xl">
                                        {user.username
                                            ? user.username[0].toUpperCase()
                                            : "G"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-base">
                                    {user.username || "ゲスト"}
                                    {UserData?.user.isprivate ? "🔒️" : ""}
                                </p>
                                <p className="text-sm text-gray-500">
                                    @{user?.userid}
                                </p>
                            </div>
                        </div>
                        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <MoreHorizontal className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={signOutEmailAndPassword}
                                >
                                    <LogOut className="mr-2 h-5 w-5" />
                                    <span>ログアウト</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
