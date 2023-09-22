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
    const facebookID = localStorage.getItem("facebookid");
    const profilePic = apiUrl + localStorage.getItem("profile_pic");
    const [timelineCounter, setTimelineCounter] = useState(0);
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);

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
            <div className="my-8 w-2/3 mx-auto">
                {postsToDisplay.length > 0 ? <ul>{postsToDisplay}</ul> : <p>No posts to display</p>}
            </div>
        );
    }
};

export default Homepage;
