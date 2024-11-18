"use client";

import { useState, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Image, X, Camera, Smile, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

const combinedSchema = tweetSchema.merge(productSchema.partial()).extend({
    isProductListing: z.boolean().default(false),
});

export default function TweetProductListingDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [media, setMedia] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setMedia([...media, ...Array.from(event.target.files)]);
        }
    };

    const removeMedia = (index: number) => {
        setMedia(media.filter((_, i) => i !== index));
    };

    function onSubmit(values: z.infer<typeof combinedSchema>) {
        setIsSubmitting(true);
        // 実際のAPIコールをここで行います
        console.log({ ...values, media });
        setTimeout(() => {
            setIsSubmitting(false);
            form.reset();
            setMedia([]);
            setIsOpen(false);
        }, 2000);
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
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="いまどうしてる？"
                                            className="resize-none text-xl border-none focus:ring-0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        document
                                            .getElementById("media-upload")
                                            ?.click()
                                    }
                                >
                                    <Camera className="w-5 h-5 text-primary" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Smile className="w-5 h-5 text-primary" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                >
                                    <MapPin className="w-5 h-5 text-primary" />
                                </Button>
                                <div className="flex-grow" />
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
                            <Input
                                id="media-upload"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaUpload}
                                multiple
                                className="hidden"
                            />
                            {media.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    {media.map((file, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-2 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Image className="w-5 h-5" />
                                                    <span className="text-sm truncate">
                                                        {file.name}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeMedia(index)
                                                    }
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
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
                                                    <SelectItem value="interior">
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
                                                    <SelectItem value="new">
                                                        新品・未使用
                                                    </SelectItem>
                                                    <SelectItem value="like-new">
                                                        未使用に近い
                                                    </SelectItem>
                                                    <SelectItem value="good">
                                                        目立った傷や汚れなし
                                                    </SelectItem>
                                                    <SelectItem value="fair">
                                                        やや傷や汚れあり
                                                    </SelectItem>
                                                    <SelectItem value="poor">
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
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                +e.target.value
                                                            )
                                                        }
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
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            +e.target.value
                                                        )
                                                    }
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
                                {280 - form.watch("content").length} 文字残り
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "投稿中..." : "ツイートする"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
