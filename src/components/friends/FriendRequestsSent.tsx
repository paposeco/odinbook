import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "./FriendThumbnail";

interface FuncProps {
    requestssent: Friend[];
    apiurl: string;
    updaterequestsent(): void;
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
                    updaterequestsent={props.updaterequestsent}
                />
            );
        });
        setUserThumbnailComponents(componentsArray);
    }, []);
    return (
        <div className="lg:w-2/3 sm:px-6 lg:px-0 mx-auto mt-8">
            <h2 className="text-2xl mb-2">Friend requests sent</h2>
            {props.requestssent.length > 0 ? (
                <ul className="flex flex-row flex-wrap justify-between">
                    {userThumbnailComponents}
                </ul>
            ) : (
                <p>No friend requests sent awaiting an answer.</p>
            )}
        </div>
    );
};

export default FriendRequestsSent;
