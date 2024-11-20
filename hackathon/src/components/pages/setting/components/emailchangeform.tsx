import React, { useState } from "react";
import { getAuth, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";


const EmailChangeForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // ボタンの無効化状態

    // メールアドレスの変更
    const changeEmail = async (newEmail: string, currentPassword: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                // 再認証（必要に応じて）
                const credential = EmailAuthProvider.credential(user.email as string, currentPassword); // user.emailがnullの可能性があるため型アサーションを使用
                await reauthenticateWithCredential(user, credential);
				setIsButtonDisabled(true); // ボタンを無効化

                // メールアドレスを変更
                await verifyBeforeUpdateEmail(user, newEmail);
                console.log("メールアドレスが変更されました");
            } catch (error) {
                if (error instanceof Error) {
                    // errorがError型であることを確認
                    setErrorMessage(`メールアドレスの変更中にエラーが発生しました: ${error.message}`);
                } else {
                    // それ以外のエラーの処理
                    setErrorMessage("メールアドレスの変更中に予期しないエラーが発生しました");
                }
            }
        } else {
            setErrorMessage("ユーザーが認証されていません");
        }
    };

    const handleEmailChange = async () => {
        if (email && password) {
            await changeEmail(email, password);
        }
    };

    return (
        <div className="p-4  max-w-4xl">
            <Card>
                <CardContent>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            {errorMessage}
                        </Alert>
                    )}
                    <div className="space-y-4">
                        <div>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label htmlFor="new-email">新しいメールアドレスを入力してください</Label>
                                    <Input
                                        id="new-email"
                                        type="email"
                                        placeholder="新しいメールアドレス"
										autoComplete="new-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="pb-4"> 
                                    <Label htmlFor="current-password">パスワードを入力してください</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        placeholder="パスワード"
										autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleEmailChange} className="w-full mt-4" disabled={isButtonDisabled}>{isButtonDisabled ? "確認メールを送信しました" : "メールアドレスを変更"}</Button>
                            </div>
                        </div>
                        
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailChangeForm;