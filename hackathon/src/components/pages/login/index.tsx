import React, { useState } from "react";
import Image from "next/image";
import { signIn, signUp } from "@/features/firebase/sign";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
  email: string;
  password: string;
  username?: string;
};

export const LoginForm: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        try {
            if (isSignUp) {
                if (!data.username) throw new Error("ユーザー名は必須です");
                const res = await signUp(data.email, data.password, data.username);
                if (!res) {
                    throw new Error("サインアップに失敗しました");
                }
				router.push("/home");
            } else {
                const res = await signIn(data.email, data.password);
                if (!res) {
                    throw new Error("ログインに失敗しました");
                }
				router.push("/home?isopen=true");
            }
            
        } catch (error) {
            console.error(error);
            // エラーメッセージを表示する処理をここに追加
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl animate-fadeIn">
                <div className="text-center">
                    <div className="flex justify-center">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/term6-namito-hirezaki.appspot.com/o/%E6%AE%B5%E8%90%BD%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88.png?alt=media&token=30c714d3-8dae-4d91-8c83-77fa1fae733e"
                            alt="logo"
                            width={120}
                            height={120}
                            className="mb-6"
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isSignUp ? "アカウントを作成" : "ログイン"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="animate-slideIn" style={{animationDelay: '0.2s'}}>
                            <label htmlFor="email-address" className="sr-only">
                                メールアドレス
                            </label>
                            <input
                                id="email-address"
                                {...register("email", { required: "メールアドレスは必須です" })}
                                type="email"
                                autoComplete="email"
                                className="relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                placeholder="メールアドレス"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                        <div className="animate-slideIn" style={{animationDelay: '0.3s'}}>
                            <label htmlFor="password" className="sr-only">
                                パスワード
                            </label>
                            <input
                                id="password"
                                {...register("password", { required: "パスワードは必須です" })}
                                type="password"
                                autoComplete="current-password"
                                className="relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                placeholder="パスワード"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>
                        {isSignUp && (
                            <div className="animate-slideIn" style={{animationDelay: '0.4s'}}>
                                <label htmlFor="username" className="sr-only">
                                    ユーザーID
                                </label>
                                <input
                                    id="username"
                                    {...register("username", { 
                                        required: "ユーザーIDは必須です", 
                                        pattern: {
                                            value: /^[a-zA-Z0-9]+$/,
                                            message: "ユーザーIDは英大小文字と数字のみ使用可能です"
                                        }
                                    })}
                                    type="text"
                                    autoComplete="username"
                                    className="relative block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition duration-300 ease-in-out"
                                    placeholder="ユーザーID（英大小文字・数字のみ）"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                                <p className="mt-1 text-sm text-gray-500">※ユーザーIDは後から変更できません</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                                isSubmitting
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    処理中...
                                </>
                            ) : (
                                isSignUp ? "アカウントを作成" : "ログイン"
                            )}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                    >
                        {isSignUp
                            ? "既にアカウントをお持ちですか？ログイン"
                            : "アカウントをお持ちでないですか？新規登録"}
                    </button>
                </div>
            </div>
        </div>
    );
};

