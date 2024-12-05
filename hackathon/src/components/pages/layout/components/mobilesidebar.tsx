"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Home, Mail, Search, UserIcon, ShoppingCart, Upload, Settings, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNavigation = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "ホーム", path: "/home" },
    { icon: Search, label: "検索", path: "/search" },
    { icon: Bell, label: "通知", path: "/notification" },
    { icon: Mail, label: "メッセージ", path: "/message" },
    { icon: UserIcon, label: "プロフィール", path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`${
              currentPath === item.path ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="h-6 w-6" />
          </Button>
        ))}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="py-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-lg mb-2"
                onClick={() => handleNavigation("/setting")}
              >
                <Settings className="mr-4 h-6 w-6" />
                設定
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-lg mb-2"
                onClick={() => handleNavigation("/purchaselist")}
              >
                <ShoppingCart className="mr-4 h-6 w-6" />
                購入情報
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-lg"
                onClick={() => handleNavigation("/listing")}
              >
                <Upload className="mr-4 h-6 w-6" />
                出品情報
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNavigation;