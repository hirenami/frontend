"use client";

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sidebar from "@/components/pages/sidebar"
import TrendsSidebar from '@/components/pages/trendsidebar'

// ダミーデータ
const userData = {
  name: "山田太郎",
  username: "@yamada_taro",
  followersCount: 1234,
  followingCount: 567
}

type User = {
	id: number;
	name: string;
	username: string;
	avatar: string;
};

type UserListProps = {
	users: User[];
	listType: string;
};


const followData = [
  { id: 1, name: "佐藤花子", username: "@sato_hanako", avatar: "/avatars/sato.jpg" },
  { id: 2, name: "鈴木一郎", username: "@suzuki_ichiro", avatar: "/avatars/suzuki.jpg" },
  { id: 3, name: "田中美咲", username: "@tanaka_misaki", avatar: "/avatars/tanaka.jpg" },
]

export default function Component() {
  const [activeTab, setActiveTab] = useState("followers")
  console.log("activeTab:", activeTab)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-80 mr-120 border-r border-l">
        

        <Tabs defaultValue="followers" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              フォロワー
              <span className="ml-2 text-sm text-muted-foreground">{userData.followersCount}</span>
            </TabsTrigger>
            <TabsTrigger value="following">
              フォロー中
              <span className="ml-2 text-sm text-muted-foreground">{userData.followingCount}</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <UserList users={followData} listType="followers" />
          </TabsContent>
          <TabsContent value="following">
            <UserList users={followData} listType="following" />
          </TabsContent>
        </Tabs>
      </main>
	  <TrendsSidebar />
    </div>
  )
}

function UserList({ users,listType } : UserListProps) {	
  return (
    <ul className="divide-y">
      {users.map((user) => (
        <li key={user.id} className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {listType === "followers" ? "フォローする" : "フォロー中"}
          </Button>
        </li>
      ))}
    </ul>
  )
}
