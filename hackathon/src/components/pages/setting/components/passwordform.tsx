import React, { useState } from "react";
import {
    getAuth,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

const PasswordChangeForm = () => {
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // ボタンの無効化状態

    // パスワードの変更
    const changePassword = async (
        newPassword: string,
        currentPassword: string
    ) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                // 再認証（必要に応じて）
                const credential = EmailAuthProvider.credential(
                    user.email as string,
                    currentPassword
                ); // user.emailがnullの可能性があるため型アサーションを使用
                await reauthenticateWithCredential(user, credential);
				setIsButtonDisabled(true); // ボタンを無効化

                // パスワードを変更
                await updatePassword(user, newPassword);
                console.log("パスワードが変更されました");
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(
                        `パスワードの変更中にエラーが発生しました: ${error.message}`
                    );
                } else {
                    setErrorMessage(
                        "パスワードの変更中に予期しないエラーが発生しました"
                    );
                }
            }
        } else {
            setErrorMessage("ユーザーが認証されていません");
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword && password) {
            await changePassword(newPassword, password);
        }
    };

    return (
        <div className="p-4 max-w-4xl">
            <Card>
                <CardContent>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            {errorMessage}
                        </Alert>
                    )}
                    <div className="space-y-4 pt-4">
                        <div>
                            <div className="space-y-2">
                                <div>
                                    <Label htmlFor="new-password">
                                        新しいパスワードを入力してください
                                    </Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="新しいパスワード"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="pb-4">
                                    <Label htmlFor="current-password">
                                        現在のパスワードを入力してください
                                    </Label>
                                    <Input
                                        id="current-password"
                                        type="password"
										autoComplete="new-password"
                                        placeholder="現在のパスワード"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={handlePasswordChange}
                                    className="w-full mt-4"
									disabled={isButtonDisabled}
                                >
                                    {isButtonDisabled ? "パスワードを変更しました" : "パスワードを変更"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordChangeForm;
