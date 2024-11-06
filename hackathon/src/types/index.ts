export type Sign = {
	signIn: (email: string, password: string) => void;
	signUp: (email: string, password: string, username: string) => void;
  };

export interface Tweet {
    tweetid: number;
	userid: string;
	retweetid: { Int32: number; Valid: boolean };
	media_url: { String: string; Valid: boolean };
	isquote: boolean;
	isreply: boolean;
	isdeleted: boolean;
    content: string;
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
    created_at: string;
}

export interface User {
    firebaseuid: string;
    userid: string;
    username: string;
    created_at: string;
    header_image: string; // 修正: null 値を許可
    icon_image: string; // 修正: null 値を許可
    biography: { String: string; Valid: boolean }; // 修正: null 値を許可
    isprivate: boolean;
    isfrozen: boolean;
    isdeleted: boolean;
    isadmin: boolean;
}

export interface Profile {
    firebaseuid: string;
    userId: string;
    username: string;
    biography: string;
    header_image: string;
    icon_image: string;
}

export interface TweetData {
	tweet: Tweet;
	user: User;
	isLiked: boolean;
	isRetweeted: boolean;
}

export interface Notification {
	notificationsid: number;
	senderid: string;
	replyid: string;
	type : string;
	created_at: string;
	contentid : { Int32: number; Valid: boolean };
	status: string;
}

export interface NotificationData {
	notification: Notification;
	user: User;
	tweet: Tweet;
}
