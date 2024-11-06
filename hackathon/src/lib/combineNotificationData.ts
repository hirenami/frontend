import {  Tweet,User,NotificationData,Notification} from '../types';

export const combineNotificationDatas = (data: {
	Notification: Notification[];
	User: User[];
	Tweet: Tweet[];
}): NotificationData[] => {
	const {
		Notification: notifications,
		User: users,
		Tweet: tweets,
	} = data;

	return notifications.map((notification, index) => ({
		notification: notification,
		user: users[index],
		tweet: tweets[index],
	}));
		
}