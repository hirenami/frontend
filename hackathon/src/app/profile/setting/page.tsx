"use client";
import React, { useState, useRef, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/features/firebase/strage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import Cookies from "js-cookie";

interface UserEditorProps {
    onSave: (user: User) => void;
}

export default function UserEditor({
    onSave,
}: UserEditorProps) {
    const [user, setUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const headerInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	 // Cookieからプロフィール情報を取得
	 const getUserFromCookie = (): User => {
        const cookieData = Cookies.get("user");
        return cookieData ? JSON.parse(cookieData) : {};
    };

    useEffect(() => {
		 // Cookieからユーザーデータを設定
		 setUser(getUserFromCookie());
    }, []);

    const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setUser((prev) => {
			if (prev) {
				return {
					...prev,
					[name]: name === "biography" 
						? { ...prev.biography, String: value, Valid: true }
						: value
				};
			}
			return prev;
		});
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        imageType: "header_image" | "icon_image"
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prev) => {
					if (prev) {
						return {
							...prev,
							[imageType]: reader.result as string, // 画像データをセット
						};
					}
					return prev; // prevがnullならそのまま返す
				});
            };
            reader.readAsDataURL(file);
        }
    };

	if (!user) {
		return <div>ユーザー情報が見つかりません</div>;
	}

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (user.username.length < 1) {
            newErrors.username = "1文字以上で入力してください";
        }
        // if (user.biography.String.length > 160) {
        //     newErrors.biography = "自己紹介は160文字以内で入力してください";
        // }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			let header_imageUrl = user.header_image;
			let icon_imageUrl = user.icon_image;
	
			if (headerInputRef.current?.files?.[0]) {
				header_imageUrl = await uploadFile(headerInputRef.current.files[0]);
			}
			if (iconInputRef.current?.files?.[0]) {
				icon_imageUrl = await uploadFile(iconInputRef.current.files[0]);
			}
	
			const getUserToken = async () => {
				const auth = getAuth();
				return new Promise<string | null>((resolve) => {
					onAuthStateChanged(auth, async (currentUser) => {
						if (currentUser) {
							const token = await currentUser.getIdToken();
							resolve(token);
						} else {
							resolve(null);
						}
					});
				});
			};
	
			const token = await getUserToken();
			if (!token) {
				console.error("認証トークンの取得に失敗しました");
				return;
			}
	
			const response = await fetch("http://localhost:8000/user/edit", {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: user.username,
					biography: user.biography.String,
					header_image: header_imageUrl,
					icon_image: icon_imageUrl,
				}),
			});
	
			if (response.ok) {
				console.log("プロフィールが正常に保存されました");
	
				// クッキーの更新
				Cookies.set("user", JSON.stringify({
					...user,
					header_image: header_imageUrl,
					icon_image: icon_imageUrl,
				}), { expires: 7 });
	
				if (onSave && user) {
					onSave({
						...user,
						header_image: header_imageUrl,
						icon_image: icon_imageUrl,
					});
				}
				router.push(`http://localhost:3000/profile/${user.userid}`);
			} else {
				console.error("プロフィールの保存中にエラーが発生しました");
			}
		}
	};	

    return (
        <div className="flex min-h-screen">
            {/* <Sidebar /> 左側のサイドバー */}
            <div className="flex-1 bg-white text-black p-6">
                {" "}
                {/* 右側の編集画面 */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 p-4 bg-white">
                    <div className="flex items-center">
                        <button
                            className="mr-4 rounded-full p-2 hover:bg-gray-200"
                            aria-label="戻る"
                            onClick={() =>
                                router.push(
                                    `http://localhost:3000/profile/${user.userid}`
                                )
                            }
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <h1 className="text-xl font-bold">
                            プロフィールを編集
                        </h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className={`rounded-full bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600`}
                    >
                        保存
                    </button>
                </header>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-full p-4"
                >
                    <div className="relative mb-6 group">
                        <Image
                            src={
                                user.header_image ||
                                "https://firebasestorage.googleapis.com/v0/b/term6-namito-hirezaki.appspot.com/o/grey.png?alt=media&token=3cfa3b15-5419-4807-932d-d19e10c52ff3"
                            }
                            alt="ヘッダー画像"
                            width={600}
                            height={200}
                            className="h-48 w-full object-cover"
                            priority
                        />
                        <button
                            type="button"
                            onClick={() => headerInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:bg-black group-hover:bg-opacity-50"
                            aria-label="ヘッダー画像をアップロード"
                        >
                            <div className="rounded-full bg-gray-800 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <Camera size={24} className="text-white" />
                            </div>
                        </button>
                        <input
                            ref={headerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleImageUpload(e, "header_image")
                            }
                            className="hidden"
                        />
                    </div>

                    <div className="relative mb-6 group w-32 h-32">
                        <Image
                            src={
                                user.icon_image ||
                                "https://firebasestorage.googleapis.com/v0/b/term6-namito-hirezaki.appspot.com/o/default_User_400x400.png?alt=media&token=44ace5f1-ef11-481f-9618-ba7d07e96b5d"
                            }
                            alt="プロフィール画像"
                            width={128}
                            height={128}
                            className="absolute h-32 w-32 rounded-full border-4 border-white"
                            priority
                        />
                        <button
                            type="button"
                            onClick={() => iconInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-200 group-hover:bg-black group-hover:bg-opacity-50"
                            aria-label="プロフィール画像をアップロード"
                        >
                            <div className="rounded-full bg-gray-800 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <Camera size={24} className="text-white" />
                            </div>
                        </button>
                        <input
                            ref={iconInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "icon_image")}
                            className="hidden"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-bold"
                        >
                            ユーザー名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleInputChange}
                            className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="text-red-500">{errors.username}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="biography"
                            className="block text-sm font-bold"
                        >
                            自己紹介
                        </label>
                        <textarea
                            id="biography"
                            name="biography"
                            value={user.biography.String}
                            onChange={handleInputChange}
                            className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                        {errors.biography && (
                            <p className="text-red-500">{errors.biography}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
