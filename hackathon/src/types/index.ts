export type Sign = {
	signIn: (email: string, password: string) => void;
	signUp: (email: string, password: string, username: string) => void;
};

export interface Tweet {
	tweetid: number;
	userid: string;
	retweetid: number;
	media_url: string;
	isquote: boolean;
	isreply: boolean;
	review: number;
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
	biography: string; // 修正: null 値を許可
	isprivate: boolean;
	ispremium: boolean;
	listingnum : number;
	isadmin: boolean;
}

export interface TweetData {
	tweet: Tweet;
	user: User;
	retweet : ReTweetData;
	likes: boolean;
	retweets: boolean;
	isblocked: boolean;
	isprivate: boolean;
}

export interface ReTweetData {
	tweet: Tweet;
	user: User;
	quote: ReTweetData | null;
	likes: boolean;
	retweets: boolean;
	isblocked: boolean;
	isprivate: boolean;
}

export interface Notification {
	notificationsid: number;
	senderid: string;
	replyid: string;
	type: string;
	created_at: string;
	contentid: number;
	status: string;
}

export interface NotificationData {
	notification: Notification;
	user: User;
	tweet: Tweet;
}

export interface FollowData {
	user: User;
	follows: number;
	followers: number;
	isfollows: boolean;
	isfollowers: boolean;
	isblocked: boolean;
	isprivate: boolean;
	isblock: boolean;
	isrequest: boolean;
}

export interface Dm {
	dmsid: number;
	senderid: string;
	receiverid: string;
	createdat: string;
	content: string;
	media_url: string;
	status: string;
}

export interface DmData {
	user: User;
	dms: Dm[];
}

export interface ListingData {
	listingid: number;
	userid: string;
	tweetid: number;
	created_at: string;
	listingname: string;
	listingdescription: string;
	listingprice: number;
	type: string;
	stock: number;
	condition: string;
}

export interface ListingItem {
	listing: ListingData;
	user: User;
	tweet: Tweet;
}

export interface ListingDetails {
	listing: ListingData;
	user: FollowData[];
	tweet: Tweet;
}


export interface PurchaseData {
	purchaseid: number;
	userid: string;
	listingid: number;
	created_at: string;
	status: string;
}

export interface PurchaseItem {
	purchase: PurchaseData;
	user: User;
	tweet: Tweet;
	listing: ListingData;
}