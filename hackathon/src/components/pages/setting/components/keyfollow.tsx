import React, { useEffect, useState } from "react";
import GetFetcher from "@/routes/getfetcher";
import { FollowData } from "@/types";
import Follow from "./keyfollowdetail";

export default function KeyFollow() {
    const { data: FollowData, token } = GetFetcher(
        "https://backend-71857953091.us-central1.run.app/keyfollow"
    );
    const [followData, setFollowData] = useState<FollowData[]>([]);

    useEffect(() => {
        if (FollowData) {
            setFollowData(FollowData);
        }
    }, [FollowData]);

    return followData.length != 0 ? (
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
