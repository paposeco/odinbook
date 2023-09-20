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
    const apiUrl = props.apiurl;
    const [token, setToken] = useState(localStorage.getItem("token"));
    //   const [tokenFetched, setTokenFetched] = useState(false);
    const [facebookID, setFacebookID] = useState(localStorage.getItem("facebookid"));
    //   const [userName, setUserName] = useState("");
    const [profilePic, setProfilePic] = useState(apiUrl + localStorage.getItem("profile_pic"));
    // const [timeline, setTimeline] = useState<Post[]>([]);
    const [timelineCounter, setTimelineCounter] = useState(0);
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);

    // useEffect(() => {
    //     const fetchInfo = async function (bearertoken: string, userFacebookID: string) {
    //         try {
    //             const response = await fetch(apiUrl + userFacebookID + "/homepage", {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${bearertoken}`
    //                 }
    //             });
    //             const responseData = await response.json();
    //             setProfilePic(apiUrl + responseData.userInfo.profile_pic);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     if (document.cookie !== "" && !tokenFetched) {
    //        // setTokenFetched(true);
    //         const fullCookie = document.cookie;
    //         const semiColon = document.cookie.indexOf(";");
    //         const cleanTokenCookie = fullCookie.slice(6, semiColon);
    //         const cleanFacebookIdCookie = fullCookie.slice(semiColon + 13, fullCookie.length);
    //         setToken(cleanTokenCookie);
    //         setFacebookID(cleanFacebookIdCookie);
    //         props.updateToken(cleanTokenCookie, cleanFacebookIdCookie);
    //         localStorage.setItem("token", cleanTokenCookie);
    //         localStorage.setItem("facebookid", cleanFacebookIdCookie);
    //         fetchInfo(cleanTokenCookie, cleanFacebookIdCookie);
    //     }
    // }, []);

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
                const postsArray = responseData.timelinePosts.map((apost: Post) => (
                    <PostComponent
                        postinfo={apost}
                        key={apost.id}
                        apiurl={apiUrl}
                        facebookid={facebookID}
                        userprofileimg={profilePic}
                    />
                ));
                setPostsToDisplay(postsArray);
            } catch (err) {
                console.log(err);
            }
        };
        if (token !== "" && facebookID !== "" && profilePic !== "") {
            fetchTimeline();
        }
    }, [token, facebookID, profilePic]);

    // header, notificacoes e logout
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    } else if (profilePic === "") {
        return (
            <div>
                <p>loading</p>
            </div>
        );
    } else {
        return (
            <div className="my-8">
                <p>Timeline</p>
                <ul>{postsToDisplay}</ul>
            </div>
        );
    }
};

export default Homepage;
