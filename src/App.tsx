import React, {useState, useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import Login from "components/Login";
import Logout from "components/Logout";
import Homepage from "components/Homepage";
import Loggedin from "components/Loggedin";
import SinglePost from "components/content/SinglePost";
import Header from "components/Header";
import FriendsList from "components/friends/FriendsList";
import FriendRequests from "components/friends/FriendRequests";
import FriendRequestsSent from "components/friends/FriendRequestsSent";
import FriendsFriendsList from "components/friends/FriendsFriendsList";
import FriendProfile from "components/friends/FriendProfile";
import FindUsers from "components/otherusers/FindUsers";
import FindUsersNearYour from "components/otherusers/FindUsersNearYou";
import Profile from "components/userprofile/Profile";
import EditProfile from "components/userprofile/EditProfile";
import type {EditableProfile, Friend} from "./common/types";

const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    const [displayname, setdisplayname] = useState("");
    const [profilepic, setprofilepic] = useState("");
    const [userProfile, setUserProfile] = useState<EditableProfile>();
    const [profileFetched, setProfileFetched] = useState(false);
    const [requestsReceived, setRequestReceived] = useState<Friend[]>([]);
    const [requestsSent, setRequestSent] = useState<Friend[]>([]);
    const [userCountry, setUserCountry] = useState("");
    const apiURL = "http://localhost:3000/";
    const authBearerToken = function (childtoken: string, childfacebookdid: string): void {
        if (token === "") {
            setToken(childtoken);
            setFacebookID(childfacebookdid);
        }
    };

    //country
    //search
    //birthday

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
                setUserCountry(
                    responseData.userprofile.country === undefined
                        ? ""
                        : responseData.userprofile.country
                );
                if (responseData.userprofile.requests_received.length > 0) {
                    setRequestReceived(responseData.userprofile.requests_received);
                }
                if (responseData.userprofile.requests_sent.length > 0) {
                    setRequestSent(responseData.userprofile.requests_sent);
                }
                localStorage.setItem("displayname", responseData.userprofile.display_name);
                localStorage.setItem("profilepic", responseData.userprofile.profile_pic);
                setdisplayname(responseData.userprofile.display_name);
                setprofilepic(responseData.userprofile.profile_pic);
                setProfileFetched(true);
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "" && facebookID !== null) {
            fetchUserInfo();
        }
    }, [token, facebookID]);

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

    const userLoggedOut = function () {
        setToken("");
    };

    const requestSent = function () {
        const fetchRequestSent = async function () {
            try {
                const response = await fetch(apiURL + facebookID + "/headerinfo", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setRequestSent(responseData.userprofile.requests_sent);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRequestSent();
    };

    const updateCountry = function (countryvalue: string) {
        setUserCountry(countryvalue);
    };

    // function to update country on editprofile
    if (token === "") {
        return (
            <div id="content" className="w-1/2 mx-auto ">
                <Routes>
                    <Route
                        path="/"
                        element={<Login apiurl={apiURL} authbearertoken={authBearerToken} />}
                    />
                    <Route path="/loggedin" element={<Loggedin updateToken={authBearerToken} />} />
                </Routes>
            </div>
        );
    } else {
        if (profileFetched) {
            return (
                <div id="content" className="w-2/3 mx-auto bg-stone-50">
                    <Header apiurl={apiURL} profilepic={profilepic} />
                    <Routes>
                        <Route
                            path="/"
                            element={<Homepage updateToken={authBearerToken} apiurl={apiURL} />}
                        />
                        <Route
                            path="/friends"
                            element={
                                <FriendsList apiurl={apiURL} updaterequestsent={requestSent} />
                            }
                        />
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
                                    updateCountry={updateCountry}
                                />
                            }
                        />
                        <Route
                            path="/user/:userfacebookid"
                            element={<FriendProfile apiurl={apiURL} />}
                        />

                        <Route
                            path="/user/:userfacebookid/friends"
                            element={
                                <FriendsFriendsList
                                    apiurl={apiURL}
                                    updaterequestsent={requestSent}
                                />
                            }
                        />
                        <Route
                            path="/friendrequests"
                            element={
                                <FriendRequests
                                    requests={requestsReceived}
                                    apiurl={apiURL}
                                    updaterequestsent={requestSent}
                                />
                            }
                        />
                        <Route
                            path="/friendrequestssent"
                            element={
                                <FriendRequestsSent
                                    requestssent={requestsSent}
                                    apiurl={apiURL}
                                    updaterequestsent={requestSent}
                                />
                            }
                        />
                        <Route
                            path="/findusers"
                            element={<FindUsers apiurl={apiURL} updaterequestsent={requestSent} />}
                        />
                        <Route
                            path="/usersnearyou"
                            element={
                                <FindUsersNearYour
                                    apiurl={apiURL}
                                    updaterequestsent={requestSent}
                                    currusercountry={userCountry}
                                />
                            }
                        />
                        <Route path="/logout" element={<Logout userloggedout={userLoggedOut} />} />
                    </Routes>
                </div>
            );
        } else {
            return <div>fetching</div>;
        }
    }
};

export default App;
