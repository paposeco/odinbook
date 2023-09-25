import React, {useState, useEffect} from "react";
import {Routes, Route, useParams} from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";
import Loggedin from "components/Loggedin";
import NewPost from "components/NewPost";
import SinglePost from "components/content/SinglePost";
import Header from "components/Header";
import FriendsList from "components/friends/FriendsList";
import FriendsFriendsList from "components/friends/FriendsFriendsList";
import FriendProfile from "components/friends/FriendProfile";
import Profile from "components/userprofile/Profile";
//import "./styles/stylesheet.css";
import type {UserProfile} from "./common/types";

const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    const [userInfo, setUserInfo] = useState();

    // user info TYPE
    // const [userInfo, setUserInfo]
    const apiURL = "http://localhost:3000/";
    const authBearerToken = function (childtoken: string, childfacebookdid: string): void {
        // not necessary. to be removed later
        if (token === "") {
            setToken(childtoken);
            setFacebookID(childfacebookdid);
        }
    };

    // place display name and profile here too

    // at this point, facebookid should be on a cookie?
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
                // set user info type
                console.log(responseData);
                setUserInfo(responseData.userprofile);
                localStorage.setItem("displayname", responseData.userprofile.display_name);
                localStorage.setItem("profilepic", responseData.userprofile.profile_pic);
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
        return (
            <div id="content" className="w-1/2 mx-auto bg-stone-50">
                <Header apiurl={apiURL} />
                <Routes>
                    <Route
                        path="/"
                        element={<Homepage updateToken={authBearerToken} apiurl={apiURL} />}
                    />
                    <Route path="/friends" element={<FriendsList apiurl={apiURL} />} />
                    <Route path="/newpost" element={<NewPost apiurl={apiURL} />} />
                    <Route
                        path="/user/:postAuthorID/post/:postID"
                        element={<SinglePost apiurl={apiURL} />}
                    />
                    <Route path="/profile" element={<Profile apirul={apiURL} />} />
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
    }
};

export default App;
