'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { Tweet, User } from "@/types"
import GetFetcher from "@/routes/getfetcher"
import { useEffect,useState } from "react"

interface Props {
	tweet: Tweet; 
}

export default function Component( {tweet}: Props) {
	const [user, setUser] = useState<User | null>(null);
	const { data: UserData } = GetFetcher('http://localhost:8080/user');
	useEffect(() => {
		if (UserData) {
			setUser(UserData.user);
		}
	},[UserData]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="その他のオプション">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>メニュー</DropdownMenuLabel>
        <DropdownMenuSeparator />
        { tweet.userid== user?.userid && <DropdownMenuItem onClick={() => console.log('編集')}>
          編集
        </DropdownMenuItem>}
        <DropdownMenuItem onClick={() => console.log('お気に入りに追加')}>
          いいねする
        </DropdownMenuItem>
		<DropdownMenuItem onClick={() => console.log('お気に入りに追加')}>
          リツイートする
        </DropdownMenuItem>
		<DropdownMenuItem onClick={() => console.log('お気に入りに追加')}>
          引用リツイートする
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        { tweet.userid== user?.userid &&  <DropdownMenuItem onClick={() => console.log('削除')} className="text-red-600">
          削除
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}