import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, Calendar, Edit3, UserCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    handleFollowCount,
    handleFollowerCount,
} from "@/features/profile/handleprofile";
import { User, TweetData, FollowData } from "@/types";
import UserEditor from "@/components/pages/profile/components/edit";
import { useState, useEffect } from "react";
import Menu from "@/components/pages/profile/components/menu";
import { handlekeyFollow } from "@/routes/profile/keyfollow";
import { handleFollow } from "@/routes/profile/follow";

interface HeaderProps {
    userData: FollowData | null;
    currentUserId: string | null;
    userid: string;
    tweets: TweetData[];
    token: string | null;
}

export const Header = ({
    userData,
    currentUserId,
    userid,
    tweets,
    token,
}: HeaderProps) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowers, setIsFollowers] = useState(false);
    const [followCount, setFollowCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [isRequest, setIsRequest] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (userData) {
            setUser(userData.user);
            setFollowCount(userData.follows);
            setFollowerCount(userData.followers);
            setIsFollowing(userData.isfollows);
            setIsFollowers(userData.isfollowers);
            setIsRequest(userData.isrequest);
        }
    }, [userData]);

    if (!user) return null;

    return (
        <>
            <header className="sticky top-0 z-10 bg-white bg-opacity-80 p-2 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            className="mr-4 rounded-full p-2 hover:bg-gray-200"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">
                                {user.username}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {tweets.length} ポスト
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative">
                <Image
                    src={user.header_image}
                    alt="プロフィールヘッダー"
                    width={600}
                    height={200}
                    className="h-48 w-full object-cover"
                    priority
                />

                <div className="absolute top-56 right-4">
                    {!(currentUserId === user.firebaseuid) && (
                        <Menu userData={userData} token={token} />
                    )}
                    {currentUserId === user.firebaseuid ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-gray-300 text-gray-900 hover:bg-gray-100"
                                onClick={() => setOpen(true)}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                プロフィールを編集
                            </Button>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent className="w-full sm:max-w-[600px] h-full sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden">
                                    <UserEditor setOpen={setOpen} />
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : !userData?.isblocked ? (
                        <Button
                            variant={
                                isFollowing ||
                                (isRequest && userData?.isprivate)
                                    ? "outline"
                                    : "default"
                            }
                            size="sm"
                            className={`rounded-full ${
                                isFollowing ||
                                (isRequest && userData?.isprivate)
                                    ? "border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-red-500 hover:border-red-500"
                                    : "bg-gray-900 text-white hover:bg-gray-800"
                            }`}
                            onClick={
                                userData?.isprivate
                                    ? () =>
                                          handlekeyFollow(
                                              userid,
                                              token,
                                              isRequest,
                                              setIsRequest
                                          )
                                    : () =>
                                          handleFollow(
                                              userid,
                                              token,
                                              isFollowing,
                                              followerCount,
                                              setIsFollowing,
                                              setFollowerCount
                                          )
                            }
                        >
                            {isFollowing ? (
                                <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    フォロー中
                                </>
                            ) : userData?.isprivate ? (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    {isRequest
                                        ? "リクエスト済み"
                                        : "フォローリクエスト"}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    フォロー
                                </>
                            )}
                        </Button>
                    ) : null}
                </div>

                <Image
                    src={user.icon_image}
                    alt={user.username || "ユーザーアイコン"}
                    width={120}
                    height={120}
                    className="absolute -bottom-16 left-4 h-32 w-32 rounded-full border-4 border-white"
                    priority
                />
            </div>

            <div className="mt-20 px-4">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-500">
                    @{user.userid}
                    {isFollowers && (
                        <span className="bg-gray-200 text-gray-500 text-xs ml-2 px-2 py-0.5">
                            フォローされています
                        </span>
                    )}
                </p>
                {user.biography && user.biography !== '""' && (
                    <p className="mt-2">{user.biography}</p>
                )}

                <div className="mt-2 text-gray-500">
                    <Calendar size={16} className="mr-1 inline" />
                    {user?.created_at
                        ? (() => {
                              const date = new Date(user.created_at);
                              return isNaN(date.getTime())
                                  ? "登録日不明"
                                  : date.toLocaleDateString() + " に登録";
                          })()
                        : "登録日"}
                </div>

                {!(userData?.isblocked || userData?.isprivate) ? (
                    <div className="mt-4 flex space-x-6 text-sm">
                        <div
                            className="flex items-center space-x-1 border-b border-transparent hover:border-black pb-0 leading-tight"
                            onClick={() => handleFollowCount(router, userid)}
                        >
                            <p className="font-bold ">{followCount}</p>
                            <p className="text-gray-500">フォロー中</p>
                        </div>
                        <div
                            className="flex items-center space-x-1 border-b border-transparent hover:border-black pb-0 leading-tight"
                            onClick={() => handleFollowerCount(router, userid)}
                        >
                            <p className="font-bold">{followerCount}</p>
                            <p className="text-gray-500">フォロワー</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};
