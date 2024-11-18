"use client";

import Image from "next/image";
import { ArrowLeft, Clock, Shield, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionDetails {
    productName: string;
    price: number;
    coupon: string;
    purchaseDate: string;
    productId: string;
    sellerName: string;
    sellerRating: string;
}

export default function Component() {
    const router = useRouter();

    const transaction: TransactionDetails = {
        productName: "中学英力練成テキスト 英語1年",
        price: 700,
        coupon: "なし",
        purchaseDate: "2022年12月29日 11:58",
        productId: "m50765246892",
        sellerName: "まとめ購入お値下5%以内",
        sellerRating: "本人確認済",
    };

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
                        <Image
                            src="/placeholder.svg"
                            alt={transaction.productName}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold mb-2">
                                {transaction.productName}
                            </h2>
                            <p className="text-2xl font-bold">
                                ¥{transaction.price.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <dl className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">プレミアム特典</dt>
                            <dd>{transaction.coupon}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">購入日時</dt>
                            <dd>{transaction.purchaseDate}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-gray-600">商品ID</dt>
                            <dd className="flex items-center gap-2">
                                {transaction.productId}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">購入者情報</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full" />
                            <div>
                                <p className="font-medium">
                                    {transaction.sellerName}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield className="w-4 h-4" />
                                    <span>{transaction.sellerRating}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="mt-4 flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>24時間以内発送</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>まとめ買い対応実績あり</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
