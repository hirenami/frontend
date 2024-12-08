'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, HelpCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function CustomerSupport() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsLoading(true)
    try {
		const response = await fetch('https://backend-71857953091.us-central1.run.app/api/gemini?query=' + query)
  
		if (response.ok) {
		  const data = await response.json()
		  setAnswer(data.answer.references[0].chunkInfo.documentMetadata.structData.answer) 
		} else {
		  setAnswer('その回答は見つかりませんでした')
		}
	  } catch (error) {
		console.error('Error fetching data:', error)
		setAnswer('エラーが発生しました')
	  } finally {
		setIsLoading(false)
	  }
	}

  return (
    <Card className="w-full max-w-xl  mx-auto mt-5">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <span>カスタマーサポート</span>
        </CardTitle>
        <CardDescription>
          AIがあなたの質問にお答えします。お気軽にお尋ねください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="質問を入力してください"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()} className="w-24">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                送信
              </>
            )}
          </Button>
        </div>
        <ScrollArea className="h-[150px] w-full rounded-md border p-4 bg-secondary/10">
          {answer ? (
            <p className="text-sm leading-relaxed">{answer}</p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              ここに回答が表示されます
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}