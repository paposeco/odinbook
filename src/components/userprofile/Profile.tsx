import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {UserProfile, Post} from "src/common/types";
import PostComponent from "components/content/Post";
import WhatsOnYourMind from "components/content/WhatsOnYourMind";

interface FuncProps {
    apirul: string;
}
const Profile: React.FC<FuncProps> = (props) => {
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState<UserProfile>();
    const apiUrl = props.apirul;
    const [infoFetched, setInfoFetched] = useState(false);
    const profilePic = apiUrl + localStorage.getItem("profile_pic");
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetchInfo = async function () {
            try {
                const response = await fetch(apiUrl + facebookid + "/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setUserInfo(responseData.user);
                if (responseData.userposts !== undefined) {
                    const postsArray = responseData.userposts.map((apost: Post) => (
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
                setInfoFetched(true);
            } catch (err) {
                console.log(err);
            }
        };
        if (!infoFetched) {
            fetchInfo();
        }
    }, []);
    if (infoFetched) {
        return (
            <div>
                <h2 className="text-lg">{userInfo.display_name}</h2>
                <Link to="/editprofile">Edit profile</Link>
                <div className="flex flex-row">
                    <img src={apiUrl + userInfo.profile_pic} alt="profilepic" className="w-48" />
                    <div>
                        {userInfo.birthday && userInfo.birthday !== "Invalid DateTime" ? (
                            <p>{userInfo.birthday}</p>
                        ) : null}
                        {userInfo.country ? <p>{userInfo.country}</p> : null}
                        {userInfo.friends === undefined || userInfo.friends.length === 0 ? (
                            <p>No friends</p>
                        ) : (
                            <Link to={`/friends`}>
                                {userInfo.friends.length}{" "}
                                {userInfo.friends.length > 1 ? "friends" : "friend"}
                            </Link>
                        )}
                    </div>
                </div>
                <WhatsOnYourMind apiurl={apiUrl} userprofile={true} />
                {postsToDisplay.length > 0 ? (
                    <ul>{postsToDisplay}</ul>
                ) : (
                    <p>You haven't posted anything</p>
                )}
            </div>
        );
    } else {
        return <div>fetching</div>;
    }
};

export default Profile;
