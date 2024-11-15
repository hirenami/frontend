'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lock, User, Trash2, Shield, Key, CreditCard, UserPlus } from 'lucide-react'

type SettingOption = {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function SettingsPage() {
  const [open, setOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<SettingOption | null>(null)

  const settingOptions: SettingOption[] = [
    { id: 'password', title: 'パスワード変更', icon: <Lock className="w-4 h-4" />, content: <PasswordChangeForm /> },
    { id: 'userid', title: 'ユーザーID変更', icon: <User className="w-4 h-4" />, content: <UserIdChangeForm /> },
    { id: 'delete', title: 'アカウント削除', icon: <Trash2 className="w-4 h-4" />, content: <AccountDeletionForm /> },
    { id: 'block', title: 'ブロック一覧', icon: <Shield className="w-4 h-4" />, content: <BlockList /> },
    { id: 'private', title: '鍵アカウントの設定', icon: <Key className="w-4 h-4" />, content: <PrivateAccountSettings /> },
    { id: 'premium', title: 'プレミアムアカウント課金', icon: <CreditCard className="w-4 h-4" />, content: <PremiumAccountBilling /> },
    { id: 'follow', title: 'フォローリクエスト', icon: <UserPlus className="w-4 h-4" />, content: <FollowRequests /> },
  ]

  const handleSettingClick = (setting: SettingOption) => {
    setSelectedSetting(setting)
    setOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-2">
          {settingOptions.map((setting) => (
            <Button
              key={setting.id}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => handleSettingClick(setting)}
            >
              <span className="flex items-center">
                {setting.icon}
                <span className="ml-2">{setting.title}</span>
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedSetting?.title}</DialogTitle>
          </DialogHeader>
          {selectedSetting?.content}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PasswordChangeForm() {
  return <div>パスワード変更フォーム</div>
}

function UserIdChangeForm() {
  return <div>ユーザーID変更フォーム</div>
}

function AccountDeletionForm() {
  return <div>アカウント削除フォーム</div>
}

function BlockList() {
  return <div>ブロックされたユーザー一覧</div>
}

function PrivateAccountSettings() {
  return <div>鍵アカウント設定</div>
}

function PremiumAccountBilling() {
  return <div>プレミアムアカウント課金情報</div>
}

function FollowRequests() {
  return <div>フォローリクエスト一覧</div>
}