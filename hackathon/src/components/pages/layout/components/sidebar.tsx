"use client";

import { Button } from "@/components/ui/button";
import {
    Bell,
    Home,
    LogOut,
    Mail,
    Search,
    User as UserIcon,
    UserPlus,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/features/firebase/auth";
import { useRouter,usePathname  } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MoreHorizontal, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { User } from "@/types/index";

const Sidebar = () => {
    const router = useRouter();
	const currentPath = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            setUser(JSON.parse(userCookie) as User); // JSON文字列をオブジェクトに変換
        }
    }, []);

    const signOutEmailAndPassword = (): void => {
        signOut(fireAuth)
            .then(() => {
                alert("ログアウトしました");
                router.push("/");
            })
            .catch((err) => {
                alert(err);
            });
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className="w-80 p-4 flex flex-col fixed min-h-screen">
            <div className="mb-8">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-10 w-10 fill-primary"
                >
                    <g>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </g>
                </svg>
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
            </nav>

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
                                    onClick={() => {
                                        console.log("click");
                                    }}
                                >
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    <span>アカウントを切り替え</span>
                                </DropdownMenuItem>
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
