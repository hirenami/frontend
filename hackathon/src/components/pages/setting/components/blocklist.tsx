import GetFetcher from "@/routes/getfetcher";
import { FollowData } from "@/types";
import { useEffect, useState } from "react";
import Block from "./blockdetail";

export default function BlockList() {
    const { data: BlockData, token } = GetFetcher(
        "http://localhost:8080/block"
    );
    const [blockData, setBlockData] = useState<FollowData[]>([]);

    useEffect(() => {
        if (BlockData) {
            setBlockData(BlockData);
        }
    }, [BlockData]);

    return blockData.length!=0 ? (
        <div>
            {blockData.map((blocks, index) => (
                <Block
                    blocks={blocks}
                    index={index}
                    token={token}
                    key={index}
                />
            ))}
        </div>
    ) : (
        <p>ブロックしているユーザーはいません</p>
    );
}
