import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {Friend} from "src/common/types";

interface FuncProps {
    friend: Friend;
    apiurl: string;
    requestreceived: boolean;
    sendrequest: boolean;
    requestsent: boolean;
}

const FriendThumbnail: React.FC<FuncProps> = (props) => {
    const userurl = "/user/" + props.friend.facebook_id;
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState("Send friend request");
    const [disableButton, setDisableButton] = useState(false);
    const [requestStatus, setRequestStatus] = useState(props.requestsent);

    const acceptfriend = async function (event: React.MouseEvent) {
        try {
            const response = await fetch(
                props.apiurl + facebookid + "/acceptfriend/" + props.friend.facebook_id,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 201) {
                navigate("/user/" + props.friend.facebook_id);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const sendRequest = async function (event: React.MouseEvent) {
        const response = await fetch(
            props.apiurl + facebookid + "/addfriend/" + props.friend.facebook_id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 201) {
            setDisableButton(true);
            setButtonText("Friend request sent");
            setRequestStatus(true);
        }
    };

    return (
        <li
            key={props.friend.facebook_id}
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
            {props.requestreceived ? (
                <button onClick={acceptfriend}>Accept friend request</button>
            ) : null}
            {props.sendrequest && !requestStatus ? (
                <button onClick={sendRequest} disabled={disableButton}>
                    {buttonText}
                </button>
            ) : null}
            {props.sendrequest && requestStatus ? <p>Friend request sent</p> : null}
        </li>
    );
};

export default FriendThumbnail;
