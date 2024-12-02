import { useEffect, useState } from "react";
import GetFetcher from "@/routes/getfetcher";
import updatePrivate from "@/routes/setting/updatePrivate";

export default function PrivateAccountSettings() {
    const { data: userdata, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );

    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const handlePrivateChange = () => {
        if (!token) {
            console.error("トークンが取得できませんでした");
            return;
        }
        setIsPrivate((prev) => !prev);
        console.log("isPrivate", !isPrivate);
        updatePrivate(token, !isPrivate);
    };

    useEffect(() => {
        if (userdata) {
            setIsPrivate(userdata.user.isprivate);
        }
    }, [userdata]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                プライバシー設定
            </h2>
            <p className="text-sm text-gray-600">
                鍵アカウントにすると、他のユーザーからのフォローリクエストが必要になります。
            </p>
            <div className="flex items-center justify-between space-x-4">
                <label
                    htmlFor="privateToggle"
                    className="text-sm font-bold text-gray-700"
                >
                    {isPrivate ? "鍵アカウントを外す" : "鍵アカウントにする"}
                </label>
                <div className="relative">
                    <input
                        id="privateToggle"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={handlePrivateChange}
                        className="absolute opacity-0 peer"
                        style={{ width: "100%", height: "100%" }} // 必要ならサイズを指定
                    />
                    <div className="w-10 h-5 bg-gray-300  peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:translate-x-5 transition-transform"></div>
                </div>
            </div>
        </div>
    );
}
