import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import GetFetcher from "@/routes/getfetcher";
import { ListingItem} from "@/types";
import { useState,useEffect } from "react";

export default function ListingHistory() {
    const router = useRouter();
	const [listing, setListing] = useState<ListingItem[]>([]);
	const { data:listingdata } = GetFetcher(`http://localhost:8080/listing`);

	useEffect(() => {
		if (listingdata) {
			setListing(listingdata);
		}
	}
	, [listingdata]);




    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center w-full border-b pb-4">
                <button
                    className="rounded-full p-2 hover:bg-gray-200"
                    onClick={() => router.push("/home")}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold ml-4">出品情報</h1>
            </div>

            <div className="bg-white rounded-lg">
                {listing.map((item) => (
                    <Link
                        key={item.listing.listingid}
                        href={`/listing/${item.listing.listingid}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b last:border-b-0"
                    >
                        <div className="relative w-16 h-16 flex-shrink-0">
							{item.tweet.media_url && (
                            <Image
                                src={item.tweet.media_url}
                                alt={item.listing.listingname}
                                fill
                                className="object-cover rounded-md"
                            />
							)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.listing.listingname}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {item.listing.listingdescription}
                            </p>
                           
                            <p className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-1">
                                在庫数{item.listing.stock}個
                             </p>
                            
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
