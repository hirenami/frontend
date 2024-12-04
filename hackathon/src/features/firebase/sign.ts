// Firebase Authenticationの処理を記述
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	setPersistence,
	browserLocalPersistence,
	signOut,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { fireAuth } from "./auth";
import { deleteUser } from "firebase/auth";

// ログイン/サインアップ処理
export const signIn = async (email: string, password: string) => {
	try {
		await setPersistence(fireAuth, browserLocalPersistence);

		const userCredential = await signInWithEmailAndPassword(
			fireAuth,
			email,
			password
		);
		const idToken = await userCredential.user.getIdToken();

		// ここでバックエンドにリクエストを送る
		await fetch("https://backend-71857953091.us-central1.run.app/login", {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
		});
		return true;
	} catch (err) {
		if (err instanceof FirebaseError) {
			alert(`${err}:SignInに失敗しました。`);
		}
		return false;
	}
};

export const signUp = async (
	email: string,
	password: string,
	username: string
) => {
	let userCredential: any = null; // userCredentialを定義
	try {
		// Firebaseでのユーザー作成
		userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
		await signOut(fireAuth);
		await setPersistence(fireAuth, browserLocalPersistence);

		// サインイン
		await signInWithEmailAndPassword(fireAuth, email, password);
		const idToken = await userCredential.user.getIdToken();

		// バックエンドのユーザー作成
		const requestBody = {
			username: username,
			userId: username,
		};

		const response = await fetch("https://backend-71857953091.us-central1.run.app/user/create", {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		// バックエンドのレスポンスを確認
		if (!response.ok) {
			throw new Error('バックエンドでユーザー作成に失敗しました。');
		}

		return true;
	} catch (err) {
		// バックエンドでエラーが発生した場合、Firebaseのユーザーを削除
		if (userCredential) {
			await deleteUser(userCredential.user); // Firebaseのユーザーを削除
		}

		if (err instanceof FirebaseError) {
			alert(`${err}:SignUpに失敗しました。`);
		}
		return false;
	}
};