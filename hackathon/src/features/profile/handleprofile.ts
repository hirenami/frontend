import { useRouter } from "next/navigation";

export const handleFollowCount = (router: ReturnType<typeof useRouter>, userid: string) => {
	router.push(`/profile/${userid}/follow?tab=follows`);
};

export const handleFollowerCount = (router: ReturnType<typeof useRouter>, userid: string) => {
	router.push(`/profile/${userid}/follow?tab=followers`);
};

export const handleEditProfile = (router: ReturnType<typeof useRouter>) => {
	router.push(`/profile/setting`);
};