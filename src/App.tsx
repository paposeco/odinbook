import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "components/Login";
import Homepage from "components/Homepage";
import What from "components/What";
import Loggedin from "components/Loggedin";
import NewPost from "components/NewPost";
import type { UserProfile } from "common/types";

const App: React.FC = () => {
    const [token, setToken] = useState("");
    const [facebookID, setFacebookID] = useState("");

    // user info TYPE
    // const [userInfo, setUserInfo]
    const apiURL = "http://localhost:3000/";
    const authBearerToken = function(childtoken: string): void {
        // not necessary. to be removed later
        if (token === "") {
            setToken(childtoken);
        }
    };

    // profile and timeline info should be fetched here and made available to components

    // at this point, facebookid should be on a cookie?
    useEffect(() => {
        if (token !== "") {
        }
        const fetchUserInfo = async function() {
            try {
                const response = await fetch(apiURL + facebookID + "/homepage", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                // set user info type
            } catch (err) {
                console.log(err);
            }
        };
    }, [token]);

    return (
        <div id="content">
            <Routes>
                <Route path="/another" element={<What />} />
                <Route path="/" element={<Homepage updateToken={authBearerToken} />} />
                <Route path="/loggedin" element={<Loggedin />} />
                <Route path="/login" element={<Login apiurl={apiURL} />} />
                <Route path="/newpost" element={<NewPost apiurl={apiURL} />} />
            </Routes>
        </div>
    );
};

export default App;
