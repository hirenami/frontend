"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Lock,
    User,
    Shield,
    Key,
    CreditCard,
    UserPlus,
} from "lucide-react";
import PremiumAccountBilling from "@/components/pages/setting/components/premium";
import PasswordChangeForm from "@/components/pages/setting/components/passwordform";
import EmailChangeForm from "@/components/pages/setting/components/emailchangeform";
import PrivateAccountSettings from "./components/privatechange";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BlockList from "./components/blocklist";
import FollowRequest from "./components/keyfollow";

type SettingOption = {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
};

export default function SettingsPage() {
    const [open, setOpen] = useState(false);
    const [selectedSetting, setSelectedSetting] =
        useState<SettingOption | null>(null);
    const router = useRouter();

    const settingOptions: SettingOption[] = [
        {
            id: "premium",
            title: "プレミアムに登録する",
            icon: <CreditCard className="w-4 h-4" />,
            content: <PremiumAccountBilling />,
        },
        {
            id: "email",
            title: "メールアドレス変更",
            icon: <User className="w-4 h-4" />,
            content: <EmailChangeForm />,
        },
        {
            id: "password",
            title: "パスワード変更",
            icon: <Lock className="w-4 h-4" />,
            content: <PasswordChangeForm />,
        },
        {
            id: "private",
            title: "鍵アカウントの設定",
            icon: <Key className="w-4 h-4" />,
            content: <PrivateAccountSettings />,
        },
        {
            id: "follow",
            title: "フォローリクエスト",
            icon: <UserPlus className="w-4 h-4" />,
            content: <FollowRequest />,
        },
        {
            id: "block",
            title: "ブロック一覧",
            icon: <Shield className="w-4 h-4" />,
            content: <BlockList />,
        },
    ];

    const handleSettingClick = (setting: SettingOption) => {
        setSelectedSetting(setting);
        setOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center w-full border-b pb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">設定</h1>
            </div>
            <ScrollArea className="h-[calc(100vh-120px)] pt-10">
                <div className="space-y-2">
                    {settingOptions.map((setting) => (
                        <Button
                            key={setting.id}
                            variant="ghost"
                            className="w-full justify-start text-left border-none focus:outline-none border-none"
                            onClick={() => handleSettingClick(setting)}
                        >
                            <span className="flex items-center">
                                {setting.icon}
                                <span className="ml-2 text-base">
                                    {setting.title}
                                </span>
                            </span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedSetting?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedSetting?.content}
                </DialogContent>
            </Dialog>
        </div>
    );
}