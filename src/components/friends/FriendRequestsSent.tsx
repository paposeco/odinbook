import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "./FriendThumbnail";

interface FuncProps {
    requestssent: Friend[];
    apiurl: string;
}

const FriendRequestsSent: React.FC<FuncProps> = function (props) {
    const [userThumbnailComponents, setUserThumbnailComponents] = useState<JSX.Element[]>();
    useEffect(() => {
        const componentsArray = [];
        props.requestssent.map((auser) => {
            componentsArray.push(
                <FriendThumbnail
                    friend={auser}
                    key={auser.facebook_id}
                    apiurl={props.apiurl}
                    requestreceived={false}
                    sendrequest={false}
                    requestsent={false}
                />
            );
        });
        setUserThumbnailComponents(componentsArray);
    }, []);
    return (
        <div className="w-2/3 mx-auto">
            <h2 className="text-xl">Friend requests sent</h2>
            {props.requestssent.length > 0 ? (
                <ul>{userThumbnailComponents}</ul>
            ) : (
                <p>No friend requests sent awaiting an answer.</p>
            )}
        </div>
    );
};

export default FriendRequestsSent;
