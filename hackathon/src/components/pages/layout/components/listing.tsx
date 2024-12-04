"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { LucideImage } from "lucide-react";
import { User } from "@/types";
import { uploadFile } from "@/features/firebase/strage";
import GetFetcher from "@/routes/getfetcher";
import { sendProductData } from "@/routes/listing/importretail";
import { customAlphabet } from "nanoid";

const tweetSchema = z.object({
    content: z
        .string()
        .min(1, "ツイート内容を入力してください")
        .max(280, "ツイートは280文字以内で入力してください"),
});

const productSchema = z.object({
    name: z.string().min(1, "商品名は必須です"),
    category: z.string({
        required_error: "カテゴリーを選択してください",
    }),
    condition: z.string({
        required_error: "商品の状態を選択してください",
    }),
    price: z.number().min(1, "価格は1円以上である必要があります"),
    description: z.string().min(1, "商品の詳細を入力してください"),
    stock: z.number().min(0, "在庫は0以上である必要があります"),
});

const combinedSchema = z
    .object({
        content: tweetSchema.shape.content,
        isProductListing: z.boolean().default(false),
        name: z.string().optional(),
        category: z.string().optional(),
        condition: z.string().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
        stock: z.number().optional(),
    })
    .refine(
        (data) => {
            if (data.isProductListing) {
                return productSchema.safeParse(data).success;
            }
            return true;
        },
        {
            message: "商品情報が不完全です",
            path: ["isProductListing"],
        }
    );

export default function CombinedTweetProductListing() {
    const [isOpen, setIsOpen] = useState(false);
    const [media, setMedia] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: UserData, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/user"
    );
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof combinedSchema>>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            content: "",
            name: "",
            price: 0,
            description: "",
            stock: 0,
            isProductListing: false,
        },
    });

    useEffect(() => {
        if (UserData) {
            setUser(UserData.user);
        }
    }, [UserData]);

    const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setMedia([...media, ...Array.from(event.target.files)]);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    async function onSubmit(values: z.infer<typeof combinedSchema>) {
        setIsSubmitting(true);
        let media_url = "";
        const generateNumericID = customAlphabet("0123456789", 12);
        const id = generateNumericID();

        try {
            if (media.length > 0) {
                media_url = await uploadFile(media[0]);
            }

            const endpoint = values.isProductListing
                ? "https://backend-71857953091.us-central1.run.app/listing"
                : "https://backend-71857953091.us-central1.run.app/tweet";

            const payload = {
                content: values.content,
                media_url: media_url,
                ...(values.isProductListing && {
                    listing: {
                        listingid: Number(id),
                        listingname: values.name,
                        listingdescription: values.description,
                        listingprice: values.price,
                        listingstock: values.stock,
                        type: values.category,
                        condition: values.condition,
                        stock: values.stock,
                    },
                }),
            };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Error posting tweet or listing");
            }

            if (values.isProductListing) {
                await sendProductData(
                    id,
                    values.category as string,
                    values.name as string,
                    values.price as number,
                    values.description as string,
                    media_url
                );
            }

            console.log("投稿が正常に完了しました");
            form.reset();
            setMedia([]);
            setIsOpen(false);
            router.push("/home");
        } catch (error) {
            console.error("投稿中にエラーが発生しました", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all mt-10">
                    ツイートと商品を出品する
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>新しいツイート</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 p-4"
                    >
                        <div className="flex space-x-4">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={user?.icon_image}
                                    alt="@username"
                                />
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={
                                                        "いまどうしてる？"
                                                    }
                                                    className="min-h-[100px] text-xl resize-none focus:ring-0 focus:border-transparent border-transparent p-0 shadow-none bg-transparent"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {media.length > 0 && (
                                    <div className="relative w-full h-60 bg-gray-200 rounded-xl overflow-hidden">
                                        {media[0].type.startsWith("image/") ? (
                                            <Image
                                                src={URL.createObjectURL(
                                                    media[0]
                                                )}
                                                alt="Uploaded media"
                                                className="w-full h-full object-cover"
                                                layout="fill"
                                            />
                                        ) : (
                                            <video
                                                src={URL.createObjectURL(
                                                    media[0]
                                                )}
                                                className="w-full h-full object-cover"
                                                controls
                                            />
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => setMedia([])}
                                        >
                                            削除
                                        </Button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex space-x-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleMediaUpload}
                                            accept="image/*,video/*"
                                            className="hidden"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={triggerFileUpload}
                                        >
                                            <LucideImage className="h-5 w-5 text-primary" />
                                        </Button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="isProductListing"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormLabel>
                                                    商品を出品する
                                                </FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        {form.watch("isProductListing") && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>商品名</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="商品名を入力してください"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>カテゴリー</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="カテゴリーを選択" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="electronics">
                                                        家電・スマホ・カメラ
                                                    </SelectItem>
                                                    <SelectItem value="fashion">
                                                        ファッション・美容
                                                    </SelectItem>
                                                    <SelectItem value="books">
                                                        本・音楽・ゲーム
                                                    </SelectItem>
                                                    <SelectItem value="sports">
                                                        スポーツ・レジャー
                                                    </SelectItem>
                                                    <SelectItem value="Home & Garden > Decor">
                                                        インテリア・住まい・小物
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>商品の状態</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="商品の状態を選択" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="新品・未使用">
                                                        新品・未使用
                                                    </SelectItem>
                                                    <SelectItem value="未使用に近い">
                                                        未使用に近い
                                                    </SelectItem>
                                                    <SelectItem value="目立った傷や汚れなし">
                                                        目立った傷や汚れなし
                                                    </SelectItem>
                                                    <SelectItem value="やや傷や汚れあり">
                                                        やや傷や汚れあり
                                                    </SelectItem>
                                                    <SelectItem value="傷や汚れあり">
                                                        傷や汚れあり
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>価格</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                        ¥
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        placeholder="価格を入力してください"
                                                        {...field}
                                                        value={
                                                            field.value !==
                                                            undefined
                                                                ? String(
                                                                      field.value
                                                                  )
                                                                : ""
                                                        } // 型を一致させる
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                +e.target
                                                                    .value || 0
                                                            )
                                                        } // 入力値を数値に変換
                                                        min="1"
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>商品の詳細</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="商品の詳細を入力してください"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>在庫数</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="在庫数を入力してください"
                                                    {...field}
                                                    value={
                                                        field.value !==
                                                        undefined
                                                            ? String(
                                                                  field.value
                                                              )
                                                            : ""
                                                    } // 型を一致させる
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value || 0
                                                        )
                                                    } // 入力値を数値に変換
                                                    min="0"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        <div className="sticky bottom-0 bg-background pt-2 pb-4 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                {user?.ispremium
                                    ? "∞"
                                    : 280 - form.watch("content").length}{" "}
                                文字残り
                            </div>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    (form.watch("content").length === 0 &&
                                        media.length === 0) ||
                                    (!user?.ispremium &&
                                        form.watch("content").length > 140)
                                }
                                className="rounded-full px-4 py-2 bg-blue-500 text-white"
                            >
                                {isSubmitting
                                    ? "投稿中..."
                                    : form.watch("isProductListing")
                                    ? "出品する"
                                    : "ツイートする"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
