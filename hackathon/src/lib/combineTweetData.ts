import { Tweet, User,TweetData } from '../types';


// combineTweetData関数の定義
export const combineTweetData = (data: {
	Tweet: Tweet;
	User: User;
	IsLike: boolean;
	IsRetweet: boolean;
}): TweetData => {
	const {
		Tweet: tweets,
		User: users,
		IsLike: isLiked,
		IsRetweet: isRetweeted,
	} = data;

	return {
		tweet: tweets,
		user: users,
		isLiked: isLiked,
		isRetweeted: isRetweeted,
	};
};

// combineTweetDatas関数の定義
export const combineTweetDatas = (data: {
	Tweet: Tweet[];
	User: User[];
	IsLike: boolean[];
	IsRetweet: boolean[];
}): TweetData[] => {
	const {
		Tweet: tweets,
		User: users,
		IsLike: isLiked,
		IsRetweet: isRetweeted,
	} = data;

	// 配列の長さが一致しているか確認
	if (
		tweets.length !== users.length ||
		tweets.length !== isLiked.length ||
		tweets.length !== isRetweeted.length
	) {
		throw new Error("配列の長さが一致していません");
	}

	return tweets.map((tweet, index) => ({
		tweet: tweet,
		user: users[index],
		isLiked: isLiked[index],
		isRetweeted: isRetweeted[index],
	}));
};