import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import type {Friend} from "src/common/types";
import {faUserClock} from "@fortawesome/free-solid-svg-icons";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FuncProps {
    friend: Friend;
    apiurl: string;
    requestreceived: boolean;
    sendrequest: boolean;
    requestsent: boolean;
    updaterequestsent(): void;
    updaterequestsreceived?(): void;
}

const FriendThumbnail: React.FC<FuncProps> = (props) => {
    const facebookid = localStorage.getItem("facebookid");
    const userurl =
        facebookid === props.friend.facebook_id ? "/profile" : "/user/" + props.friend.facebook_id;
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
                props.updaterequestsreceived();
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
        // function from app to update info
        if (response.status === 201) {
            setDisableButton(true);
            setButtonText("Friend request sent");
            setRequestStatus(true);
            props.updaterequestsent();
        }
    };

    return (
        <li
            key={props.friend.facebook_id}
            className="flex flex-col gap-2 justify-center w-60 bg-white rounded-lg p-6 m-4 "
        >
            <Link to={userurl} className="text-center text-sm no-underline text-gray-700 font-bold">
                {props.friend.display_name}
            </Link>
            <Link to={userurl}>
                <img
                    src={props.apiurl + props.friend.profile_pic}
                    alt="profilepic"
                    className="rounded-full aspect-square w-40 h-40 object-cover mx-auto"
                />
            </Link>
            {props.requestreceived ? (
                <button onClick={acceptfriend} className="underline">
                    Accept friend request
                </button>
            ) : null}
            {props.sendrequest && !requestStatus ? (
                <div className="flex flex-row gap-2 items-center justify-center">
                    <FontAwesomeIcon icon={faUserPlus} className="w-5" />
                    <button onClick={sendRequest} disabled={disableButton} className="underline">
                        {buttonText}
                    </button>
                </div>
            ) : null}
            {props.sendrequest && requestStatus ? (
                <div className="flex flex-row gap-2 items-center justify-center">
                    <FontAwesomeIcon icon={faUserClock} className="w-5" />
                    <p>Friend request sent</p>
                </div>
            ) : null}
        </li>
    );
};

export default FriendThumbnail;
