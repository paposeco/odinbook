import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Post} from "../common/types";
import PostComponent from "components/content/Post";

interface FuncProps {
    updateToken(arg1: string, arg2: string): void;
    apiurl: string;
}

type FormValues = {
    newprofilepic: string;
};

const Homepage: React.FC<FuncProps> = (props) => {
    const [token, setToken] = useState("");
    const [tokenFetched, setTokenFetched] = useState(false);
    const [facebookID, setFacebookID] = useState("");
    const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    // const [timeline, setTimeline] = useState<Post[]>([]);
    const [timelineCounter, setTimelineCounter] = useState(0);
    const apiUrl = props.apiurl;
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetchInfo = async function (bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch(apiUrl + userFacebookID + "/homepage", {
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
            props.updateToken(cleanTokenCookie, cleanFacebookIdCookie);
            localStorage.setItem("token", cleanTokenCookie);
            localStorage.setItem("facebookid", cleanFacebookIdCookie);
            fetchInfo(cleanTokenCookie, cleanFacebookIdCookie);
        }
    }, []);

    useEffect(() => {
        const fetchPic = async function (bearertoken: string, userFacebookID: string) {
            try {
                const response = await fetch(apiUrl + userFacebookID + "/profilepic", {
                    method: "GET",
                    headers: {
                        //"Content-Type": "application/json",
                        Authorization: `Bearer ${bearertoken}`
                    }
                });

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

    useEffect(() => {
        const fetchTimeline = async function () {
            try {
                const response = await fetch(apiUrl + facebookID + "/posts/timeline", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                console.log(responseData);
                //setTimeline(responseData.timelinePosts);
                const postsArray = responseData.timelinePosts.map((apost: Post) => (
                    <PostComponent postinfo={apost} key={apost.id} />
                ));
                console.log(postsArray);
                setPostsToDisplay(postsArray);
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "" && facebookID !== "") {
            fetchTimeline();
        }
    }, [token, facebookID]);

    // header, notificacoes e logout
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    } else {
        return (
            <div>
                <div className="flex flex-row gap-4">
                    <div>
                        <p>Friends</p>
                        <p>Profile</p>
                    </div>
                    <div>
                        <div className="flex flex-row gap-4">
                            <p className="text-3xl">Hello {userName}</p>
                            <img src={profilePic} alt="profile pic" />
                        </div>
                        <div>
                            <p>Timeline</p>
                            <ul>{postsToDisplay}</ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Homepage;
