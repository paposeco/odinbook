import React, {useState, useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";
import Loggedin from "components/Loggedin";
import SinglePost from "components/content/SinglePost";
import Header from "components/Header";
import FriendsList from "components/friends/FriendsList";
import FriendsFriendsList from "components/friends/FriendsFriendsList";
import FriendProfile from "components/friends/FriendProfile";
import Profile from "components/userprofile/Profile";
import EditProfile from "components/userprofile/EditProfile";
import type {EditableProfile} from "./common/types";

const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    const [displayname, setdisplayname] = useState("");
    const [profilepic, setprofilepic] = useState("");
    const [userProfile, setUserProfile] = useState<EditableProfile>();
    const [profileFetched, setProfileFetched] = useState(false);

    const apiURL = "http://localhost:3000/";
    const authBearerToken = function (childtoken: string, childfacebookdid: string): void {
        if (token === "") {
            setToken(childtoken);
            setFacebookID(childfacebookdid);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async function () {
            try {
                const response = await fetch(apiURL + facebookID + "/headerinfo", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setUserProfile({
                    displayname: responseData.userprofile.display_name,
                    birthday:
                        responseData.userprofile.birthday === undefined
                            ? ""
                            : responseData.userprofile.birthday,
                    gender:
                        responseData.userprofile.gender === undefined
                            ? "Empty"
                            : responseData.userprofile.gender,
                    country:
                        responseData.userprofile.country === undefined
                            ? ""
                            : responseData.userprofile.country
                });
                localStorage.setItem("displayname", responseData.userprofile.display_name);
                localStorage.setItem("profilepic", responseData.userprofile.profile_pic);
                setdisplayname(responseData.userprofile.display_name);
                setprofilepic(responseData.userprofile.profile_pic);
                setProfileFetched(true);
                console.log(responseData.userprofile);
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "") {
            fetchUserInfo();
        }
    }, [token]);

    useEffect(() => {
        const tokenexists = localStorage.getItem("token");
        if (!tokenexists) {
            setToken("");
        } else {
            setToken(tokenexists);
        }
    }, []);

    const updateProfileImg = function (filepath: string): void {
        setprofilepic(filepath);
    };
    // token and facebookid should be accessible here as a starting point
    // need to move check for login here and then that should be possible
    // maybe I should fetch userinfo here too and just send it to every component ?
    // maybe I could have a separate component that handles the response from logging in facebook

    // facebookid and token are accessible here now

    if (token === "") {
        return (
            <div id="content" className="w-1/2 mx-auto ">
                <Routes>
                    <Route path="/" element={<Login apiurl={apiURL} />} />
                    <Route path="/loggedin" element={<Loggedin updateToken={authBearerToken} />} />
                </Routes>
            </div>
        );
    } else {
        if (profileFetched) {
            return (
                <div id="content" className="w-1/2 mx-auto bg-stone-50">
                    <Header apiurl={apiURL} profilepic={profilepic} />
                    <Routes>
                        <Route
                            path="/"
                            element={<Homepage updateToken={authBearerToken} apiurl={apiURL} />}
                        />
                        <Route path="/friends" element={<FriendsList apiurl={apiURL} />} />
                        <Route
                            path="/user/:postAuthorID/post/:postID"
                            element={<SinglePost apiurl={apiURL} />}
                        />
                        <Route path="/profile" element={<Profile apirul={apiURL} />} />
                        <Route
                            path="/editprofile"
                            element={
                                <EditProfile
                                    apiurl={apiURL}
                                    updateProfileImg={updateProfileImg}
                                    currentprofile={userProfile}
                                />
                            }
                        />
                        <Route
                            path="/user/:userfacebookid"
                            element={<FriendProfile apiurl={apiURL} />}
                        />

                        <Route
                            path="/user/:userfacebookid/friends"
                            element={<FriendsFriendsList apiurl={apiURL} />}
                        />
                    </Routes>
                </div>
            );
        } else {
            return <div>fetching</div>;
        }
    }
};

export default App;
