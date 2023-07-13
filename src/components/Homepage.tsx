import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface FuncProps {
    updateToken(arg: string): void;
}

const Homepage: React.FC<FuncProps> = (props) => {
    const [token, setToken] = useState("");
    const [tokenFetched, setTokenFetched] = useState(false);
    const [facebookID, setFacebookID] = useState("");
    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const fetchInfo = async function(bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch("http://localhost:3000/" + userFacebookID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${bearertoken}`
                    }
                });
                const responseData = await response.json();

                setUserName(responseData.userInfo.display_name);
                // api request for file
            } catch (err) {
                console.log(err);
            }
        };
        if (document.cookie !== "" && !tokenFetched) {
            setTokenFetched(true);
            const fullCookie = document.cookie;
            const semiColon = document.cookie.indexOf(";");
            const cleanTokenCookie = fullCookie.slice(6, semiColon);
            const cleanFacebookIdCookie = fullCookie.slice(semiColon + 13, fullCookie.length);
            setToken(cleanTokenCookie);
            setFacebookID(cleanFacebookIdCookie);
            props.updateToken(cleanTokenCookie);
            localStorage.setItem("token", cleanTokenCookie);
            fetchInfo(cleanTokenCookie, cleanFacebookIdCookie);
        }
    }, []);

    useEffect(() => {
        const fetchPic = async function(bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch(
                    "http://localhost:3000/" + userFacebookID + "/profilepic",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${bearertoken}`
                        }
                    }
                );
                const blob = await response.blob();
                setProfilePic(URL.createObjectURL(blob));
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "" && facebookID !== "") {
            fetchPic(token, facebookID);
        }
    }, [facebookID, token]);

    // once token is fetched, query api for content
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login with Facebook</Link>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Homepage</h1>
                <p>Hello {userName}</p>
                <img src={profilePic} alt="profile pic" />
            </div>
        );
    }
};

export default Homepage;
