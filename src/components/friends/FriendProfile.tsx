import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router";
import {Link} from "react-router-dom";
import type {Friend, Post} from "src/common/types";
import PostComponent from "components/content/Post";
import RemoveFriend from "./removefriend";
import {getCountryName} from "components/userprofile/CountrySelector";

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
    const [countryDisplayName, setCountryDisplayName] = useState("");
    const [userFriends, setUserFriends] = useState("");

    const [fetchedMore, setFetchedMore] = useState(false);
    const [endTimeline, setEndTimeline] = useState(false);
    const [fetchCounter, setFetchCounter] = useState(0);

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
                }

                setStatusChecked(true);
            } catch (err) {
                console.log(err);
            }
        };
        if (!friendStatus) {
            checkFriendStatus();
        }
    }, []);
    useEffect(() => {
        const fetchUserInfo = async function () {
            const fetchurl =
                props.apiurl +
                facebookid +
                "/otheruserprofile/" +
                userfacebookid +
                "/" +
                fetchCounter;
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
                if (fetchCounter === 0) {
                    setFetchCounter(1);
                }
                if (responseData.posts.length < 3) {
                    setEndTimeline(true);
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
                }
            } catch (err) {
                console.log(err);
            }
        };

        if (!infoFetched) {
            if (fetchedMore) {
                setFetchCounter(fetchCounter + 1);
            }
            fetchUserInfo();
        }
    }, []);

    useEffect(() => {
        const handleScroll = function () {
            setFetchedMore((fetchedMore) => {
                if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 0.1 * document.body.offsetHeight
                ) {
                    setInfoFetched(false);
                    return true;
                }
                return false;
            });
        };
        if (!endTimeline) {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

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
            setFriendStatus(true);
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

    if (!infoFetched && fetchCounter === 0) {
        return <div>fetching</div>;
    } else if (infoFetched && statusChecked) {
        return (
            <div>
                <h2 className="text-lg">{userInfo.display_name}</h2>
                {friendStatus ? <p>You are friends</p> : null}
                {friendStatus ? <button onClick={removeFriend}>Remove friend</button> : null}
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
                {!friendStatus && friendRequestSent ? <p>Friend request sent</p> : null}
                {!friendStatus && !friendRequestSent ? (
                    <button onClick={handleClick}>Add Friend</button>
                ) : null}

                <div className="flex flex-row">
                    <img src={apiUrl + userInfo.profile_pic} alt="profilepic" className="w-48" />
                    <div>
                        {userInfo.birthday && userInfo.birthday !== "Invalid DateTime" ? (
                            <p>{userInfo.birthday}</p>
                        ) : null}
                        {userInfo.country ? <p>{countryDisplayName}</p> : null}

                        {userInfo.friends === undefined || userInfo.friends === 0 ? (
                            <p>{userFriends}</p>
                        ) : (
                            <Link to={`/user/${userfacebookid}/friends`}>
                                {userInfo.friends} {userInfo.friends > 1 ? "friends" : "friend"}
                            </Link>
                        )}
                    </div>
                </div>

                {postsToDisplay.length > 0 ? (
                    <ul>{postsToDisplay}</ul>
                ) : (
                    <p>This user hasn't posted anything yet</p>
                )}
            </div>
        );
    }
};

export default UserProfile;
