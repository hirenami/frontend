import React, { useEffect, useState } from "react";
import GetFetcher from "@/routes/getfetcher";
import { FollowData } from "@/types";
import Follow from "./keyfollowdetail";

export default function KeyFollow() {
	const { data: FollowData, token } = GetFetcher(
        "http://localhost:8080/keyfollow"
    );
    const [followData, setFollowData] = useState<FollowData[]>([]);

    useEffect(() => {
       if(FollowData){
		   setFollowData(FollowData);
	   }
    }, [FollowData]);

    return followData.length!=0 ? (
        <div>
            {followData.map((follows, index) => (
                <Follow
                    follows={follows}
                    index={index}
                    token={token}
                    key={index}
                />
            ))}
        </div>
    ) : (
        <p>フォローリクエストはありません</p>
    );
}