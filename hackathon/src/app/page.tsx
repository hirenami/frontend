"use client";

import { LoginForm } from "@/components/pages/loginform";
import { signIn, signUp } from "@/features/firebase/sign";
import useAuth from "@/hooks/useAuth";

export default function Home() {
    const loginUser = useAuth();

    return (
        <div>
            {/* ログインしていない場合はLoginFormを表示 */}
            {!loginUser && <LoginForm signIn={signIn} signUp={signUp} />}
        </div>
    );
}
