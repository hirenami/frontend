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
import { createblock,deleteblock } from "@/routes/profile/block";

interface Props {
	userData : FollowData | null;
	token : string | null;
}

export default function Component({ userData, token  }: Props) {	
	const [isblock, setIsBlock] = useState(userData?.isblock);	
	const router = useRouter();

	const handleBlockToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		console.log("ブロックトグル");
		setIsBlock(!isblock);
		if(isblock){
		deleteblock(token, userData?.user.userid);
		}else{
		createblock(token, userData?.user.userid);
		}
	}

	const handleDM = async (e: React.MouseEvent) => {
		e.preventDefault();
		CreateDM(token, userData?.user.userid, "", "");
		router.push("/message");
	}

	if(userData?.isblocked || userData?.isprivate){
		return null;
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
                    {isblock ?  "ブロック解除" : "ブロックする" }
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
