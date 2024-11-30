"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FollowData } from "@/types";
import { useState } from "react";
import { CreateDM } from "@/routes/message/createdm";
import { useRouter } from "next/navigation";

interface Props {
	userData : FollowData | null;
	token : string | null;
}

export default function Component({ userData, token  }: Props) {		
	const [isblocked, setIsBlocked] = useState(userData?.isblocked);
	const router = useRouter();

	const handleBlockToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsBlocked(!isblocked);
		console.log("ブロックトグル");
	}

	const handleDM = async (e: React.MouseEvent) => {
		e.preventDefault();
		CreateDM(token, userData?.user.userid, "", "");
		router.push("/message");
	}

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="その他のオプション"
					className="rounded-full border mr-2"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>メニュー</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => handleBlockToggle(e)}
                >
                    {isblocked ?  "ブロック解除" : "ブロックする" }
                </DropdownMenuItem>
				<DropdownMenuItem
                    onClick={(e) => handleDM(e)}
                >
                    {"ダイレクトメッセージ"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
