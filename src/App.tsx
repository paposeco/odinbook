import React, {useState, useEffect} from "react";
import {Routes, Route, useParams} from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";
import What from "components/What";
import Loggedin from "components/Loggedin";
import NewPost from "components/NewPost";
import SinglePost from "components/content/SinglePost";
//import "./styles/stylesheet.css";
import type {UserProfile} from "./common/types";

const App: React.FC = () => {
    const [token, setToken] = useState("");
    const [facebookID, setFacebookID] = useState("");
    let {postID} = useParams();
    let {postAuthorID} = useParams();

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

    // at this point, facebookid should be on a cookie?
    useEffect(() => {
        const fetchUserInfo = async function () {
            try {
                const response = await fetch(apiURL + facebookID + "/homepage", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                console.log(responseData);
                // set user info type
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "") {
            console.log(apiURL + facebookID + "/homepage");
            fetchUserInfo();
        }
    }, [token]);

    return (
        <div id="content" className="w-1/2 mx-auto">
            <Routes>
                <Route path="/another" element={<What />} />
                <Route
                    path="/"
                    element={<Homepage updateToken={authBearerToken} apiurl={apiURL} />}
                />
                <Route path="/loggedin" element={<Loggedin />} />
                <Route path="/login" element={<Login apiurl={apiURL} />} />
                <Route path="/newpost" element={<NewPost apiurl={apiURL} />} />
                <Route
                    path="user/:postAuthorID/post/:postID"
                    element={<SinglePost apiurl={apiURL} />}
                />
            </Routes>
        </div>
    );
};

export default App;
