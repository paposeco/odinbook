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
import Fetching from "components/Fetching";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import Teste from "components/Teste";

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
    const [requestsNumber, setRequestsNumber] = useState(0);
    const apiURL = "https://odinbookbackend-production.up.railway.app/";
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
                setUserCountry(
                    responseData.userprofile.country === undefined
                        ? ""
                        : responseData.userprofile.country
                );
                if (responseData.userprofile.requests_received.length > 0) {
                    setRequestReceived(responseData.userprofile.requests_received);
                    // requests number and birthdays
                    setRequestsNumber(responseData.userprofile.requests_received.length);
                }
                if (responseData.userprofile.birthdaystoday.length > 0) {
                    setRequestsNumber(responseData.userprofile.birthdaystoday.length);
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
        localStorage.removeItem("profilepic");
        setprofilepic(filepath);
        localStorage.setItem("profilepic", filepath);
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
            <div id="content" className="mx-auto bg-gray-100 min-h-screen flex flex-col w-full">
                <Header apiurl={""} profilepic={""} notifications={0} />
                <div className="mx-auto lg:w-8/12 w-full mt-8 grow">
                    <Routes>
                        <Route
                            path="/"
                            element={<Login apiurl={apiURL} authbearertoken={authBearerToken} />}
                        />
                        <Route
                            path="/loggedin/:aString"
                            element={<Loggedin updateToken={authBearerToken} />}
                        />
                        <Route path="/teste" element={<Teste />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        );
    } else {
        if (profileFetched) {
            return (
                <div id="content" className="mx-auto bg-gray-100 min-h-screen flex flex-col">
                    <Header
                        apiurl={apiURL}
                        profilepic={profilepic}
                        notifications={requestsNumber}
                    />
                    <div className="flex flex-row grow">
                        <Sidebar apiurl={apiURL} profilepic={profilepic} />
                        <div className="mx-auto lg:w-8/12 w-full">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Homepage updateToken={authBearerToken} apiurl={apiURL} />
                                    }
                                />
                                <Route
                                    path="/friends"
                                    element={
                                        <FriendsList
                                            apiurl={apiURL}
                                            updaterequestsent={requestSent}
                                        />
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
                                    element={
                                        <FindUsers
                                            apiurl={apiURL}
                                            updaterequestsent={requestSent}
                                        />
                                    }
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
                                <Route
                                    path="/logout"
                                    element={<Logout userloggedout={userLoggedOut} />}
                                />
                            </Routes>
                        </div>
                        <div className="lg:w-2/12 px-4"></div>
                    </div>
                    <Footer />
                </div>
            );
        } else {
            return <Fetching />;
        }
    }
};

export default App;
