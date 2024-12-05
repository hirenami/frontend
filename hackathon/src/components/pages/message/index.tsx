"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import GetFetcher from "@/routes/getfetcher";
import { DmData } from "@/types";
import Detail from "./components/detail";
import { User } from "@/types";
import { Button } from "@/components/ui/button";

export default function DirectMessage() {
    const [selectedUserDm, setSelectedUserDm] = useState<DmData | null>(null);
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

    const UserList = () => (
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200">
            <div className="flex items-center w-full border-b p-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200 md:hidden"
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
                            selectedUserDm?.user.userid === dmdata.user.userid
                                ? "bg-gray-100"
                                : ""
                        }`}
                        onClick={() => setSelectedUserDm(dmdata)}
                    >
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
                                {dmdata.dms.length > 0 && dmdata.dms[0].content}
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-white text-black">
            {/* モバイルでの表示 */}
            <div className="md:hidden w-full h-full flex flex-col">
                {selectedUserDm ? (
                    <>
                        <div className="flex items-center border-b p-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedUserDm(null)}
                            >
                                <ArrowLeft size={20} />
                            </Button>
                            <Avatar className="h-8 w-8 ml-2">
                                <AvatarImage
                                    src={selectedUserDm.user.icon_image}
                                    alt={selectedUserDm.user.username}
                                />
                            </Avatar>
                            <span className="ml-2 font-semibold">
                                {selectedUserDm.user.username}
                            </span>
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <Detail dmdata={selectedUserDm} user={user} token={token} />
                        </div>
                    </>
                ) : (
                    <UserList />
                )}
            </div>

            {/* デスクトップでの表示 */}
            <div className="hidden md:flex w-full">
                <UserList />
                <div className="flex-grow overflow-hidden">
					{selectedUserDm && (
                    <Detail dmdata={selectedUserDm} user={user} token={token} />
					)}
                </div>
            </div>
        </div>
    );
}

