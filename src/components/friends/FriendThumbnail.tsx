import React from "react";
import {Link} from "react-router-dom";
import type {Author} from "src/common/types";

interface FuncProps {
    friend: Author;
    apiurl: string;
}

const FriendThumbnail: React.FC<FuncProps> = (props) => {
    const userurl = "/user/" + props.friend.facebook_id;
    return (
        <li
            key={props.friend.id}
            className="flex flex-col gap-4 justify-center w-48 bg-stone-100 rounded-lg p-8 m-8"
        >
            <Link to={userurl} className="text-center text-sm no-underline text-gray-700 font-bold">
                {props.friend.display_name}
            </Link>
            <Link to={userurl}>
                <img
                    src={props.apiurl + props.friend.profile_pic}
                    alt="profilepic"
                    className="rounded-full"
                />
            </Link>
        </li>
    );
};

export default FriendThumbnail;
