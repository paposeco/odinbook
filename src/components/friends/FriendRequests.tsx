import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "./FriendThumbnail";

interface FuncProps {
    requests: Friend[];
    apiurl: string;
}

const FriendRequests: React.FC<FuncProps> = function (props) {
    const [userThumbnailComponents, setUserThumbnailComponents] = useState<JSX.Element[]>();
    useEffect(() => {
        const componentsArray = [];
        props.requests.map((auser) => {
            componentsArray.push(
                <FriendThumbnail
                    friend={auser}
                    key={auser.facebook_id}
                    apiurl={props.apiurl}
                    requestreceived={true}
                    sendrequest={false}
                    requestsent={false}
                />
            );
        });
        setUserThumbnailComponents(componentsArray);
    }, []);
    return (
        <div className="w-2/3 mx-auto">
            <h2 className="text-xl">Friend requests received</h2>
            {props.requests.length > 0 ? (
                <ul>{userThumbnailComponents}</ul>
            ) : (
                <p>No new friend requests received.</p>
            )}
        </div>
    );
};

export default FriendRequests;
