import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {Link} from "react-router-dom";
import type {Friend, Post} from "src/common/types";
import PostComponent from "components/content/Post";
import RemoveFriend from "./RemoveFriend";
import {getCountryName} from "components/userprofile/CountrySelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCakeCandles} from "@fortawesome/free-solid-svg-icons";
import {faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {faUserXmark} from "@fortawesome/free-solid-svg-icons";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {faUserClock} from "@fortawesome/free-solid-svg-icons";
import Fetching from "components/Fetching";

interface FuncProps {
    apiurl: string;
}

const UserProfile: React.FC<FuncProps> = (props) => {
    const [userInfo, setUserInfo] = useState<Friend>();
    const [infoFetched, setInfoFetched] = useState(false);
    const {userfacebookid} = useParams();
    const navigate = useNavigate();
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const apiUrl = props.apiurl;
    const profilePic = apiUrl + localStorage.getItem("profile_pic");
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);
    const [showRemoveFriendComp, setShowRemoveFriendComp] = useState(false);
    const [statusChecked, setStatusChecked] = useState(false);
    const [friendStatus, setFriendStatus] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [friendRequestReceived, setFriendRequesReceived] = useState(false);
    const [countryDisplayName, setCountryDisplayName] = useState("");
    const [userFriends, setUserFriends] = useState("");
    const [noposts, setnoposts] = useState("This user hasn't posted anything yet.");

    const acceptfriend = async function (event: React.MouseEvent) {
        try {
            const response = await fetch(apiUrl + facebookid + "/acceptfriend/" + userfacebookid, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                setInfoFetched(false);
                setStatusChecked(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const checkFriendStatus = async function () {
            try {
                const response = await fetch(
                    props.apiurl + facebookid + "/relationship/" + userfacebookid,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const responseData = await response.json();

                setFriendStatus(responseData.friends);
                if (!responseData.friends) {
                    setFriendRequestSent(responseData.requestsent);
                    setFriendRequesReceived(responseData.requestreceived);
                    setnoposts("Add user to see posts.");
                }

                setStatusChecked(true);
            } catch (err) {
                console.log(err);
            }
        };
        if (!statusChecked) {
            checkFriendStatus();
        }
    }, [statusChecked]);

    useEffect(() => {
        const fetchUserInfo = async function () {
            const fetchurl = props.apiurl + facebookid + "/otheruserprofile/" + userfacebookid;
            try {
                const response = await fetch(fetchurl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                const responseData = await response.json();
                setUserInfo(responseData);
                setInfoFetched(true);
                if (responseData.country !== undefined) {
                    const countryvalue = responseData.country;
                    const countryName = getCountryName(countryvalue);
                    setCountryDisplayName(countryName);
                }

                if (responseData.posts !== undefined && responseData.posts.length > 0) {
                    const postsArray = responseData.posts.map((apost: Post) => (
                        <PostComponent
                            postinfo={apost}
                            key={apost.id}
                            apiurl={apiUrl}
                            facebookid={responseData.facebook_id}
                            userprofileimg={profilePic}
                        />
                    ));
                    setPostsToDisplay(postsArray);
                }
                if (responseData.friends === undefined) {
                    setUserFriends("Add " + responseData.display_name + " to see their friends.");
                } else if (responseData.friend === 0) {
                    setUserFriends(responseData.display_name + " doesn't have any friends");
                } else if (responseData.friends !== undefined) {
                    setFriendStatus(true);
                }
            } catch (err) {
                console.log(err);
            }
        };

        if (!infoFetched) {
            fetchUserInfo();
        }
    }, [infoFetched]);

    // add friend
    const handleClick = async function (event: React.MouseEvent) {
        const response = await fetch(apiUrl + facebookid + "/addfriend/" + userfacebookid, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 201) {
            setFriendRequestSent(true);
            // setFriendStatus(true);
        }
    };

    const removeFriend = function (event: React.MouseEvent) {
        setShowRemoveFriendComp(true);
    };

    const cancelRemoveFriend = function (event: React.MouseEvent) {
        setShowRemoveFriendComp(false);
    };

    const friendRemoved = function () {
        setFriendStatus(false);
        navigate("/friends");
    };

    if (!infoFetched) {
        return <Fetching />;
    } else if (infoFetched && statusChecked) {
        return (
            <div className="lg:w-2/3 sm:px-6 lg:px-0 mx-auto mt-8">
                <div className="flex flex-col sm:flex-row gap-8 mb-12">
                    <img
                        src={apiUrl + userInfo.profile_pic}
                        alt="profilepic"
                        className="w-48 rounded-full aspect-square object-cover h-48"
                    />
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">{userInfo.display_name}</h2>
                        {friendStatus ? <p>You are friends</p> : null}
                        {friendStatus ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserXmark} className="w-5" />
                                <button onClick={removeFriend} className="underline">
                                    Remove friend
                                </button>
                            </div>
                        ) : null}
                        {showRemoveFriendComp ? (
                            <RemoveFriend
                                apiurl={apiUrl}
                                facebookid={facebookid}
                                friendfacebookid={userfacebookid}
                                friendname={userInfo.display_name}
                                cancelremovefriend={cancelRemoveFriend}
                                friendremoved={friendRemoved}
                            />
                        ) : null}
                        {!friendStatus && friendRequestSent ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserClock} className="w-5" />
                                <p>Friend request sent</p>
                            </div>
                        ) : null}

                        {!friendStatus && !friendRequestSent && friendRequestReceived ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserClock} className="w-5" />
                                <button onClick={acceptfriend} className="underline">
                                    Accept friend request
                                </button>
                            </div>
                        ) : null}

                        {!friendStatus && !friendRequestSent && !friendRequestReceived ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserPlus} className="w-5" />
                                <button onClick={handleClick}>Add Friend</button>
                            </div>
                        ) : null}

                        {userInfo.birthday && userInfo.birthday !== "Invalid DateTime" ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faCakeCandles} className="w-5" />
                                <p>{userInfo.birthday}</p>
                            </div>
                        ) : null}
                        {userInfo.gender !== undefined && userInfo.gender !== "" ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faVenusMars} className="w-5" />
                                <p>
                                    {userInfo.gender.replace(
                                        userInfo.gender[0],
                                        userInfo.gender[0].toUpperCase()
                                    )}
                                </p>
                            </div>
                        ) : null}
                        {userInfo.country ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faGlobe} className="w-5" />
                                <p>{countryDisplayName}</p>
                            </div>
                        ) : null}

                        {friendStatus && userInfo.friends > 0 ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserGroup} className="w-5" />
                                <Link to={`/user/${userfacebookid}/friends`}>
                                    {userInfo.friends} {userInfo.friends > 1 ? "friends" : "friend"}
                                </Link>
                            </div>
                        ) : null}
                        {friendStatus && userInfo.friends === 0 ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserGroup} className="w-5" />
                                <p>{userFriends}</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                {postsToDisplay.length > 0 ? (
                    <ul>{postsToDisplay}</ul>
                ) : (
                    <p className="my-4">{noposts}</p>
                )}
            </div>
        );
    }
};

export default UserProfile;
