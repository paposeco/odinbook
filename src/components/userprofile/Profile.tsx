import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {UserProfile, Post} from "src/common/types";
import PostComponent from "components/content/Post";
import WhatsOnYourMind from "components/content/WhatsOnYourMind";
import {getCountryName} from "./CountrySelector";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCakeCandles} from "@fortawesome/free-solid-svg-icons";
import {faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import Fetching from "components/Fetching";

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
    const [countryDisplayName, setCountryDisplayName] = useState("");

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
                if (responseData.user.country !== undefined) {
                    const countryvalue = responseData.user.country.country;
                    const countryName = getCountryName(countryvalue);
                    setCountryDisplayName(countryName);
                }

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
            <div className="lg:w-2/3 sm:px-6 lg:px-0 mx-auto mt-8">
                <div className="flex flex-col sm:flex-row gap-8 mb-12">
                    <img
                        src={apiUrl + userInfo.profile_pic}
                        alt="profilepic"
                        className="w-48 h-48 rounded-full object-cover aspect-square"
                    />
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">{userInfo.display_name}</h2>

                        {userInfo.birthday !== undefined &&
                        userInfo.birthday !== "Invalid DateTime" ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faCakeCandles} className="w-5" />
                                <p>{userInfo.date_birthday}</p>
                            </div>
                        ) : null}
                        {userInfo.gender !== undefined && userInfo.gender !== "" ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faVenusMars} className="w-5" />
                                <p>
                                    {userInfo.gender.replace(
                                        userInfo.gender[0],
                                        userInfo.gender[0].toLocaleUpperCase
                                    )}
                                </p>
                            </div>
                        ) : null}
                        {userInfo.country !== undefined && countryDisplayName !== "" ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faGlobe} className="w-5" />
                                <p>{countryDisplayName}</p>
                            </div>
                        ) : null}
                        {userInfo.friends === undefined || userInfo.friends.length === 0 ? (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserGroup} className="w-5" />
                                <p>0 friends</p>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-center">
                                <FontAwesomeIcon icon={faUserGroup} className="w-5" />
                                <Link to={`/friends`}>
                                    {userInfo.friends.length}{" "}
                                    {userInfo.friends.length > 1 ? "friends" : "friend"}
                                </Link>
                            </div>
                        )}
                        <div className="flex flex-row gap-2 items-center">
                            <FontAwesomeIcon icon={faPencil} className="w-5" />
                            <Link to="/editprofile">
                                <p>Edit profile</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <WhatsOnYourMind apiurl={apiUrl} userprofile={true} />
                {postsToDisplay.length > 0 ? (
                    <ul>{postsToDisplay}</ul>
                ) : (
                    <p className="my-4">You haven't posted anything.</p>
                )}
            </div>
        );
    } else {
        return <Fetching />;
    }
};

export default Profile;
