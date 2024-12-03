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
	try {
		await createUserWithEmailAndPassword(fireAuth, email, password);
		await signOut(fireAuth);
		await setPersistence(fireAuth, browserLocalPersistence); // サインアップ後にセッションを保持
		const userCredential = await signInWithEmailAndPassword(
			fireAuth,
			email,
			password
		);
		const idToken = await userCredential.user.getIdToken();

		const requestBody = {
			username: username,
			userId: username,
		};

		await fetch("https://backend-71857953091.us-central1.run.app/user/create", {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});
		return true;
	} catch (err) {
		if (err instanceof FirebaseError) {
			alert(`${err}:SignUpに失敗しました。`);
		}
		return false;
	}
};