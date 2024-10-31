// Firebase Authenticationの処理を記述
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	setPersistence,
	browserLocalPersistence,
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
		const response = await fetch("http://localhost:8000/login", {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		console.log("Backend Response:", data);
	} catch (err) {
		if (err instanceof FirebaseError) {
			alert(`${err}:SignInに失敗しました。`);
		}
	}
};

export const signUp = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		await createUserWithEmailAndPassword(fireAuth, email, password);
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

		await fetch("http://localhost:8000/user/create", {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${idToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});
	} catch (err) {
		if (err instanceof FirebaseError) {
			alert(`${err}:SignUpに失敗しました。`);
		}
	}
};