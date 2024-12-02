"use client";

import { LoginForm } from "@/components/pages/login";

export default function Home() {
    return (
        <div>
            {/* ログインしていない場合はLoginFormを表示 */}
            <LoginForm />
        </div>
    );
}
