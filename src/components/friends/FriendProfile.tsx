import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import type {Friend, Post} from "src/common/types";
import PostComponent from "components/content/Post";

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
    if (infoFetched) {
        return (
            <div>
                <h2 className="text-lg">{userInfo.display_name}</h2>
                <div className="flex flex-row">
                    <img src={apiUrl + userInfo.profile_pic} alt="profilepic" className="w-96" />
                    <div>
                        {userInfo.birthday && userInfo.birthday !== "Invalid DateTime" ? (
                            <p>{userInfo.birthday}</p>
                        ) : null}
                        {userInfo.country ? <p>{userInfo.country}</p> : null}
                        {userInfo.friends === undefined || userInfo.friends === 0 ? (
                            <p>No friends</p>
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
