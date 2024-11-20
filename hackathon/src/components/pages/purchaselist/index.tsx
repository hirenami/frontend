import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseItem {
    id: string;
    name: string;
    image: string;
    purchaseDate: string;
    status?: "取引中" | "完了";
}

const purchaseHistory: PurchaseItem[] = [
    {
        id: "1",
        name: "中学実力練成テキスト 英語1年",
        image: "/placeholder.svg",
        purchaseDate: "2022/12/29 11:59",
        status: "完了",
    },
    {
        id: "2",
        name: "EarFun Air Pro 充電ケース　充電器",
        image: "/placeholder.svg",
        purchaseDate: "2022/04/11 10:05",
        status: "完了",
    },
];

export default function PurchaseHistory() {
    const router = useRouter();
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center w-full border-b pb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.push("/home")}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">購入情報</h1>
            </div>

            <div className="bg-white rounded-lg">
                {purchaseHistory.map((item) => (
                    <Link
                        key={item.id}
                        href={`/purchase/${item.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b last:border-b-0"
                    >
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {item.purchaseDate}
                            </p>
                            {item.status && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-1">
                                    {item.status}
                                </span>
                            )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
