"use client";

import Image from "next/image";
import { ArrowLeft, ChevronRight, ShoppingCartIcon} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { PurchaseItem, User } from "@/types";
import GetFetcher from "@/routes/getfetcher";
import {date} from "@/lib/Date";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";

export default function Component() {
    const router = useRouter();
	const { id } = useParams();
	const Id = id as unknown as number;

	const [purchase, setPurchase] = useState<PurchaseItem>();
	const [user , setUser] = useState<User>();
	const { data: purchasedata } = GetFetcher(`http://localhost:8080/purchase/${Id}`);
	const { data: userdata } = GetFetcher(`http://localhost:8080/user`);

	useEffect(() => {
		if (purchasedata) {
			setPurchase(purchasedata);
		}
		if (userdata) {
			setUser(userdata.user);
		}
	}
	, [purchasedata , userdata]);

	if (!purchase) {
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

            <Alert className="bg-yellow-50 border-yellow-100 mb-6">
                <AlertDescription className="flex items-center gap-2">
                    ✓ 取引が完了しました
                    <p className="text-gray-600">
                        このたびはXのご利用ありがとうございました。
                    </p>
                </AlertDescription>
            </Alert>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex gap-4 mb-6">
						{purchase.tweet.media_url ? (
                        <Image
                            src={purchase.tweet.media_url}
                            alt={purchase.listing.listingname}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                        />
						):(
							<ShoppingCartIcon className="w-16 h-16 text-gray-400" />
						)}
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold mb-2">
                                {purchase.listing.listingname}
                            </h2>
                            <p className="text-2xl font-bold">
                                ¥{purchase.listing.listingprice.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <dl className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">プレミアム特典</dt>
                            { user?.ispremium ? <dd>2%割引</dd> : <dd>なし</dd>}
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">購入日時</dt>
                            <dd>{date(purchase.purchase.created_at)}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">商品ID</dt>
                            <dd className="flex items-center gap-2">
                                {purchase.listing.listingid}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 hover:bg-gray-100" onClick={() =>router.push(`/profile/${purchase.user.userid}`)}>
                    <h3 className="font-semibold mb-4">出品者情報</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
							<Avatar className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
								<AvatarImage src={purchase.user.icon_image} />
							</Avatar>
                            <div>
                                <p className="font-medium">
                                    {purchase.user.username}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>@{purchase.user.userid}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="mt-4 flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span>{purchase.user.biography}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
