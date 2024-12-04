import PaypalButton from "@/components/pages/purchase/components/paypalbutton";
import GetFetcher from "@/routes/getfetcher";
import { useEffect, useState } from "react";
import { updatePremium } from "@/routes/purchase/post";

export default function PremiumAccountBilling() {
    // プレミアム会員かどうか
    const [isPremium, setIsPremium] = useState<boolean>(false);

    const { data: userdata, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );

    // 支払い成功時にプレミアム状態を更新する
    const handlePaymentSuccess = () => {
        if (!token) {
            console.error("トークンが取得できませんでした");
            return;
        }
        setIsPremium(true);
        updatePremium(token);
    };

    useEffect(() => {
        if (userdata) {
            setIsPremium(userdata.user.ispremium);
        }
    }, [userdata, isPremium]);

    return (
        <>
            <div className="flex flex-col bg-white rounded-md shadow-md p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    追加機能
                </h2>
                <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                        <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12l5 5L20 7"
                            ></path>
                        </svg>
                        商品を無制限に出品可能
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                        <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12l5 5L20 7"
                            ></path>
                        </svg>
                        購入時2%の割引
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                        <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12l5 5L20 7"
                            ></path>
                        </svg>
                        ツイートの文字数制限がなくなります
                    </li>
                </ul>
            </div>
            {!isPremium ? (
                <>
                    <PaypalButton
                        productId="premium"
                        value={1000}
                        isOpen={true}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-700">
                            ¥<span className="font-semibold">1,000</span>で
                            <span className="font-semibold text-blue-500">
                                プレミアムに登録
                            </span>
                            できます
                        </p>
                    </div>
                </>
            ) : (
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-700 font-bold">
                        現在プレミアムに登録しています
                    </p>
                </div>
            )}
        </>
    );
}
