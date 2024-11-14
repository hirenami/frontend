import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { User } from "@/types";

interface HeaderProps {
	user: User | null;
	token: string | null;
}


export default function Header( { user, token }: HeaderProps) {
	
	const hundleUserClick = async () => {
		try {
			if (token) {
				window.location.href = `/profile/${user?.userid}`; // ユーザーページへ遷移
			}
		} catch (error) {
			console.error("ユーザーページへの遷移に失敗しました:", error);
		}
	};

	return (
		<div className="flex justify-between">
				<div className="flex">
					<Button
						className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
						onClick={hundleUserClick}
					>
						<Avatar className="w-full h-full rounded-full">
							<AvatarImage
								src={user?.icon_image}
								alt={user?.userid}
							/>
							<AvatarFallback>{user?.userid}</AvatarFallback>
						</Avatar>
					</Button>

					{/* ツイートの内容 */}

					<div className="flex space-x-1 truncate flex-col ml-2">
						{/* ユーザー名とID */}
						<button
							className="text-base font-bold text-gray-900 hover:underline bg-transparent p-0 focus:outline-none"
							onClick={hundleUserClick}
						>
							{user?.username}
						</button>
						<button
							className="text-sm text-gray-500 bg-transparent pr-6 focus:outline-none whitespace-nowrap"
							onClick={hundleUserClick}
						>
							@{user?.userid}
						</button>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="text-gray-500 hover:text-primary"
				>
					<MoreHorizontal className="h-5 w-5" />
				</Button>
			</div>
	)
}