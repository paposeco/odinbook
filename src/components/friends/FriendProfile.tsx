import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import type {Friend, Post} from "src/common/types";
import PostComponent from "components/content/Post";
import RemoveFriend from "./removefriend";

interface FuncProps {
    apiurl: string;
}

const UserProfile: React.FC<FuncProps> = (props) => {
    const [userInfo, setUserInfo] = useState<Friend>();
    const [infoFetched, setInfoFetched] = useState(false);
    const {userfacebookid} = useParams();
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const apiUrl = props.apiurl;
    const profilePic = apiUrl + localStorage.getItem("profile_pic");
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);
    const [showRemoveFriendComp, setShowRemoveFriendComp] = useState(false);
    const [statusChecked, setStatusChecked] = useState(false);
    const [friendStatus, setFriendStatus] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);

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
                if (responseData.posts !== undefined) {
                    const postsArray = responseData.timelinePosts.map((apost: Post) => (
                        <PostComponent
                            postinfo={apost}
                            key={apost.id}
                            apiurl={apiUrl}
                            facebookid={facebookid}
                            userprofileimg={profilePic}
                        />
                    ));
                    setPostsToDisplay(postsArray);
                }
            } catch (err) {
                console.log(err);
            }
        };

        if (!infoFetched) {
            fetchUserInfo();
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

    if (infoFetched && statusChecked) {
        return (
            <div>
                <h2 className="text-lg">{userInfo.display_name}</h2>
                {friendStatus ? <p>You are friends</p> : null}
                {friendStatus ? <button onClick={removeFriend}>Remove friend</button> : null}
                {showRemoveFriendComp ? (
                    <RemoveFriend
                        apiurl={apiUrl}
                        friendfacebookid={userfacebookid}
                        friendname={userInfo.display_name}
                        cancelremovefriend={cancelRemoveFriend}
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
                        {userInfo.country ? <p>{userInfo.country}</p> : null}
                        {userInfo.friends === undefined || userInfo.friends === 0 ? (
                            <p>{userInfo.display_name} doesn't have any friends</p>
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
    } else {
        return <div>fetching</div>;
    }
};

export default UserProfile;
