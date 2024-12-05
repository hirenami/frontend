"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import GetFetcher from "@/routes/getfetcher";
import { ListingItem, User } from "@/types";
import PaypalButton from "./components/paypalbutton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { purchase } from "@/routes/purchase/tweetpost";
import { postevents } from "@/routes/purchase/postevents";

export default function PurchaseForm() {
    const { tweetId } = useParams();
    const tweetid = tweetId as unknown as number;
    const router = useRouter();
    const [listing, setListing] = useState<ListingItem | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isPaypalOpen, setIsPaypalOpen] = useState(false);
    const {
        data: listingData,
        error,
        token,
    } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/listing/${tweetid}/tweetid`
    );
    const { data: userdata } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/user`
    );

    useEffect(() => {
        if (listingData) {
            setListing(listingData);
        }
        if (userdata) {
            setUser(userdata.user);
        }
		postevents(token, listingData.listing.listingid);
    }, [listingData, userdata, token]);

    const handlePaymentSuccess = () => {
        // 支払い成功後の処理
        alert("購入が完了しました！");
        if (token && listing) {
            purchase(token, listing.listing.listingid);
        }
        router.push(`/purchaselist`); // 購入履歴ページなどに遷移
    };

    if (error) {
        return (
            <div className="text-center text-red-500">
                エラーが発生しました。再度お試しください。
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="flex items-center w-full border-b pb-4 mb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">商品を購入する</h1>
            </div>

            <div className="bg-white rounded-lg border p-4 mb-6">
                <div className="flex items-start space-x-3 mb-4">
                    <Avatar>
                        <AvatarImage
                            src={listing.user.icon_image}
                            alt={listing.user.username}
                        />
                        <AvatarFallback>{listing.user.username}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold">{listing.user.username}</p>
                        <p className="text-gray-500">@{listing.user.userid}</p>
                    </div>
                </div>
                <p className="mb-4">{listing.tweet.content}</p>
                {listing.tweet.media_url && (
                    <div className="relative w-full h-64 mb-4">
                        <Image
                            src={listing.tweet.media_url}
                            alt="Tweet media"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg border p-4">
                <h2 className="text-xl font-bold mb-4">
                    {listing.listing.listingname}
                </h2>
                <p className="text-gray-700 mb-4">
                    {listing.listing.listingdescription}
                </p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">
                            価格:
                            {user?.ispremium && "プレミアム特典により2%の割引"}
                        </span>
                        <span className="font-bold text-lg">
                            ¥
                            {user?.ispremium
                                ? Math.floor(
                                      listing.listing.listingprice * 0.98
                                  ).toLocaleString()
                                : listing.listing.listingprice.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">商品の状態:</span>
                        <span>{listing.listing.condition}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">残り:</span>
                        <span>{listing.listing.stock}点</span>
                    </div>
                    {listing.listing.stock > 0 ? (
                        isPaypalOpen ? (
                            <PaypalButton
                                productId={listing.listing.listingid.toString()}
                                value={
                                    user?.ispremium
                                        ? Math.floor(
                                              listing.listing.listingprice *
                                                  0.98
                                          )
                                        : listing.listing.listingprice
                                }
                                isOpen={isPaypalOpen}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        ) : (
                            <Button
                                onClick={() => setIsPaypalOpen(true)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                購入する
                            </Button>
                        )
                    ) : (
                        <Button
                            disabled
                            className="w-full bg-gray-300 text-gray-500"
                        >
                            在庫切れ
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
