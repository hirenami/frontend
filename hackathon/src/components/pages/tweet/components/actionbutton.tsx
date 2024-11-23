'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Repeat, Heart, Quote, ShoppingCart } from 'lucide-react'
import { createLike, deleteLike } from "@/features/like/likes"
import { createRetweet, deleteRetweet } from "@/features/retweet/handleretweets"
import { Tweet } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import RetweetItem from "./retweetItems"
import CreateQuote from "@/components/pages/tweetitem/component/createquote"
import {useRouter} from "next/navigation"

interface ActionButtonProps {
  tweet: Tweet
  token: string | null
  isliked: boolean
  setIsLiked: (isLiked: boolean) => void
  likeData: number
  setLikeData: (likeData: number) => void
  isretweet: boolean
  setIsRetweet: (isRetweet: boolean) => void
  retweetCount: number
  setRetweetCount: (retweetCount: number) => void
  isblocked: boolean
  isprivate: boolean
}

export default function ActionButton({
  tweet,
  token,
  isliked,
  setIsLiked,
  likeData,
  setLikeData,
  isretweet,
  setIsRetweet,
  retweetCount,
  setRetweetCount,
  isblocked,
  isprivate,
}: ActionButtonProps) {
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
  const router = useRouter()

  const handleLikeToggle = async () => {
    try {
      if (token && tweet) {
        if (isliked) {
          await deleteLike(tweet, token)
          setIsLiked(false)
          setLikeData(likeData - 1)
        } else {
          await createLike(tweet, token)
          setIsLiked(true)
          setLikeData(likeData + 1)
        }
      }
    } catch (error) {
      console.error("いいねのトグルに失敗しました:", error)
    }
  }

  const handleRetweetToggle = async () => {
    try {
      if (token && tweet) {
        if (isretweet) {
          await deleteRetweet(tweet, token)
          setIsRetweet(false)
          setRetweetCount(retweetCount - 1)
        } else {
          await createRetweet(tweet, token)
          setIsRetweet(true)
          setRetweetCount(retweetCount + 1)
        }
      }
    } catch (error) {
      console.error("リツイートのトグルに失敗しました:", error)
    }
  }

  return (
    <div className="mt-3 flex justify-between max-w-md">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-gray-500 hover:text-primary"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{tweet.replies}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${
              isretweet ? "text-green-500" : "text-gray-500"
            } hover:text-green-500`}
          >
            <Repeat className="h-4 w-4" />
            <span className="text-xs">{retweetCount}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleRetweetToggle}>
            <Repeat className="mr-2 h-4 w-4" />
            <span>リツイート</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsQuoteDialogOpen(true)}>
            <Quote className="mr-2 h-4 w-4" />
            <span>引用リツイート</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center space-x-2 ${
          isliked ? "text-red-500" : "text-gray-500"
        } hover:text-red-500`}
        onClick={handleLikeToggle}
      >
        <Heart
          className={`h-4 w-4 ${
            isliked ? "fill-current text-red-500" : "text-gray-500"
          }`}
        />
        <span className="text-xs">{likeData}</span>
      </Button>
	  {tweet.review == -1 && ( 
		<Button
			variant="ghost"
			size="sm"
			className="flex items-center space-x-2 text-gray-500 hover:text-primary"
			onClick = {(e) => {
				e.stopPropagation();
				router.push(`/purchase/${tweet.tweetid}`)
			}
			}
		>
			<ShoppingCart className="h-4 w-4" />
			<span className="text-xs">購入</span>
		</Button>
	  )}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>引用リツイート</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
		  <CreateQuote  tweetId={tweet.tweetid}  retweetCount={retweetCount} setIsQuoteDialogOpen={setIsQuoteDialogOpen} setRetweetCount={setRetweetCount} />
			<div className="border rounded-md p-4">
			<RetweetItem tweet={tweet} isblocked={isblocked} isprivate={isprivate}/>
			</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}