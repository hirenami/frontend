import React, { useState } from "react";
import { Sign } from "@/types";
import Image from "next/image";

export const LoginForm = (props: Sign) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignUp) {
            props.signUp(email, password, username);
        } else {
            props.signIn(email, password);
        }
        setEmail("");
        setPassword("");
        setUsername("");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-2xl animate-fadeIn">
                <div className="text-center">
                    <div className="flex justify-center">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/term6-namito-hirezaki.appspot.com/o/%E6%AE%B5%E8%90%BD%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88.png?alt=media&token=30c714d3-8dae-4d91-8c83-77fa1fae733e"
                            alt="logo"
                            width={100}
                            height={100}
                            className="mb-6"
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">
                        {isSignUp ? "アカウントを作成" : "ログイン"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="animate-slideIn" style={{animationDelay: '0.2s'}}>
                            <label htmlFor="email-address" className="sr-only">
                                メールアドレス
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition duration-300 ease-in-out"
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="animate-slideIn" style={{animationDelay: '0.3s'}}>
                            <label htmlFor="password" className="sr-only">
                                パスワード
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition duration-300 ease-in-out"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {isSignUp && (
                            <div className="animate-slideIn" style={{animationDelay: '0.4s'}}>
                                <label htmlFor="username" className="sr-only">
                                    ユーザー名
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="relative block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition duration-300 ease-in-out"
                                    placeholder="ユーザー名"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                        >
                            {isSignUp ? "アカウントを作成" : "ログイン"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
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