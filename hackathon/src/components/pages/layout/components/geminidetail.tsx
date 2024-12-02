import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GetFetcher from "@/routes/getfetcher";
import { ListingItem } from "@/types";
import Image from "next/image";
import { ShoppingCartIcon, ArrowRight } from 'lucide-react';

interface Props {
  id: number;
  index: number;
}

export default function GeminiDetail({ id, index }: Props) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingItem>();
  const { data: listingData } = GetFetcher(
    `http://localhost:8080/listing/${id}`
  );

  useEffect(() => {
    if (listingData) {
      setListing(listingData);
    }
  }, [listingData, id]);

  if (!listing) {
    return null;
  }

  return (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
      onClick={() => router.push(`/purchase/${listing.tweet.tweetid}`)}
    >
      <div className="relative h-48 w-full">
        {listing.tweet.media_url ? (
          <Image
            src={listing.tweet.media_url}
            alt={listing.listing.listingname}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
          ¥{listing.listing.listingprice.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">
          {listing.listing.listingname}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {listing.listing.listingdescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-semibold">詳細を見る</span>
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

