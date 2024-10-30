import { fireAuth, fireStorage } from './auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file: File): Promise<string> => {
    try {
        // 認証されたユーザーを取得
        const user = fireAuth.currentUser;
        if (!user) throw new Error("ユーザーが認証されていません");
        console.log("ユーザーが認証されました");

        // ファイル名をユニークにするためにUUIDを生成
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        
        // アップロード先のディレクトリをファイルの種類によって決定
        const fileType = file.type.split('/')[0]; // 'image'または'video'を取得
        let storagePath;

        if (fileType === 'image') {
            storagePath = `uploads/${user.uid}/images/${uniqueFileName}`;
        } else if (fileType === 'video') {
            storagePath = `uploads/${user.uid}/videos/${uniqueFileName}`;
        } else {
            throw new Error("サポートされていないファイルタイプです");
        }

        // ストレージリファレンスを作成
        const storageRef = ref(fireStorage, storagePath);
        
        // アップロード処理をPromiseでラップ
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('アップロード進捗: ' + progress + '%');
                },
                (error) => {
                    console.error("アップロードエラー:", error);
                    reject(error); // エラーの場合はPromiseを拒否
                },
                () => {
                    // アップロード成功時にダウンロードURLを取得
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('ファイルがアップロードされました:', downloadURL);
                        resolve(downloadURL); // 成功時にはPromiseを解決
                    }).catch((error) => {
                        reject(error); // ダウンロードURLの取得に失敗した場合もPromiseを拒否
                    });
                }
            );
        });
    } catch (error) {
        console.error("ファイルアップロードエラー:", error);
        return ""; // エラー時には空の文字列を返す
    }
};