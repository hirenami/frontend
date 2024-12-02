"use client";

import Image from "next/image";
import { ArrowLeft, ShoppingCartIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ListingDetails, User } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import { date } from "@/lib/Date";
import Follow from "@/components/pages/follow/components/follow";

export default function Component() {
    const router = useRouter();
    const { id } = useParams();
    const Id = id as unknown as number;

    const [listing, setlisting] = useState<ListingDetails>();
    const [user, setUser] = useState<User>();
    const { data: listingdata } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/listing/${Id}`
    );
    const { data: userdata } = GetFetcher(
        `https://backend-71857953091.us-central1.run.app/user`
    );

    useEffect(() => {
        if (listingdata) {
            setlisting(listingdata);
        }
        if (userdata) {
            setUser(userdata.user);
        }
    }, [listingdata, userdata]);

    if (!listing) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center w-full pb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">取引詳細</h1>
            </div>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex gap-4 mb-6">
                        {listing.tweet.media_url ? (
                            <Image
                                src={listing.tweet.media_url}
                                alt={listing.listing.listingname}
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
                        )}
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold mb-2">
                                {listing.listing.listingname}
                            </h2>
                            <p className="text-2xl font-bold">
                                ¥
                                {user?.ispremium
                                    ? Math.floor(
                                          listing.listing.listingprice * 0.98
                                      ).toLocaleString()
                                    : listing.listing.listingprice.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <dl className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">商品説明</dt>
                            <dd>{listing.listing.listingdescription}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">出品日時</dt>
                            <dd>{date(listing.listing.created_at)}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">商品ID</dt>
                            <dd className="flex items-center gap-2">
                                {listing.listing.listingid}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <h2 className="font-semibold mb-4">購入者情報</h2>
            {listing.user.map((user, index) => (
                <Follow key={index} follower={user} index={index} />
            ))}
        </div>
    );
}
