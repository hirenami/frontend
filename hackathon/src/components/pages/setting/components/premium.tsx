import PaypalButton from "@/components/pages/purchase/components/paypalbutton";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User } from "@/types";

export default function PremiumAccountBilling() {
	// ユーザーデータ
	const [user, setUser] = useState<User>();
	// プレミアム会員かどうか
	const isPremium = user?.ispremium;
    
	// Cookieからプロフィール情報を取得
    const getUserFromCookie = (): User => {
        const cookieData = Cookies.get("user");
        return cookieData ? JSON.parse(cookieData) : {};
    };

    useEffect(() => {
        // Cookieからユーザーデータを設定
        setUser(getUserFromCookie());
    }, []);

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
                        商品を出品可能
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
                        購入情報を管理
                    </li>
                </ul>
            </div>
            {!isPremium ? (
                <>
                    <PaypalButton
                        productId="premium"
                        value={1000}
                        isOpen={true}
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
