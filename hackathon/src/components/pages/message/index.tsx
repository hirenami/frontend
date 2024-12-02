"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import GetFetcher from "@/routes/getfetcher";
import { DmData } from "@/types";
import Detail from "./components/detail";
import { User } from "@/types";

export default function DirectMessage() {
    const [selectedUserDm, setSelectedUserDm] = useState<DmData>();
    const router = useRouter();
    const { data, error, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/dm"
    );
    const [dmsdata, setDmsData] = useState<DmData[]>([]);
    const { data: userdata } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );
    const [user, setUser] = useState<User>();

    useEffect(() => {
        if (data) {
            setDmsData(data);
        }
        if (userdata) {
            setUser(userdata.user);
        }
    }, [data, userdata]);

    if (error) return <div>Error: {error.message}</div>;
    if (!dmsdata) return <div>No data</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-white text-black">
            {/* ユーザー一覧 */}
            <div className="w-2/5 border-r border-gray-200">
                <div className="flex items-center w-full border-b p-4">
                    <button
                        className="rounded-full p-2 hover:bg-gray-200"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold ml-4">メッセージ</h1>
                </div>
                <ScrollArea className="h-[calc(100vh-80px)] overflow-y-auto">
                    {dmsdata.map((dmdata) => (
                        <div
                            key={dmdata.dms[0].dmsid}
                            className={`relative flex items-center p-4 cursor-pointer hover:bg-gray-100 border-b ${
                                selectedUserDm?.user.userid ===
                                dmdata.user.userid
                                    ? "bg-gray-100"
                                    : ""
                            }`}
                            onClick={() => setSelectedUserDm(dmdata)}
                        >
                            {/* 未読の場合、右上に青い◯を表示 */}
                            {dmdata.dms.length > 0 &&
                                dmdata.dms[0].status === "unread" &&
                                dmdata.dms[0].senderid !== user?.userid && (
                                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                )}
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={dmdata.user.icon_image}
                                    alt={dmdata.user.username}
                                />
                            </Avatar>
                            <div className="ml-4">
                                <div className="font-semibold">
                                    {dmdata.user.username}
                                    {dmdata.user.isprivate ? "🔒️" : ""}
                                </div>
                                <div className="text-sm text-gray-400">
                                    @{dmdata.user.userid}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {dmdata.dms.length > 0 &&
                                        dmdata.dms[0].content}
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* メッセージ詳細 */}
            <Detail dmdata={selectedUserDm} user={user} token={token} />
        </div>
    );
}
