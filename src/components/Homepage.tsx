import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Post} from "../common/types";
import PostComponent from "components/content/Post";
import WhatsOnYourMind from "./content/WhatsOnYourMind";

interface FuncProps {
    updateToken(arg1: string, arg2: string): void;
    apiurl: string;
}

type FormValues = {
    newprofilepic: string;
};

const Homepage: React.FC<FuncProps> = (props) => {
    const apiUrl = props.apiurl;
    const token = localStorage.getItem("token");
    const facebookID = localStorage.getItem("facebookid");
    const profilePic = apiUrl + localStorage.getItem("profile_pic");
    const [postsToDisplay, setPostsToDisplay] = useState<JSX.Element[]>([]);
    const [newPost, setNewPost] = useState(false);
    const [postsFetched, setPostsFetched] = useState(false);
    const [fetchedMore, setFetchedMore] = useState(false);
    const [endTimeline, setEndTimeline] = useState(false);
    const [fetchCounter, setFetchCounter] = useState(0);

    useEffect(() => {
        const fetchTimeline = async function () {
            try {
                const response = await fetch(
                    apiUrl + facebookID + "/posts/timeline/" + fetchCounter,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const responseData = await response.json();
                const componentsArray = [...postsToDisplay];
                responseData.timelinePosts.map((apost: Post) => {
                    componentsArray.push(
                        <PostComponent
                            postinfo={apost}
                            key={apost.id}
                            apiurl={apiUrl}
                            facebookid={facebookID}
                            userprofileimg={profilePic}
                        />
                    );
                });
                if (fetchCounter === 0) {
                    setFetchCounter(1);
                }
                if (responseData.timelinePosts.length < 3) {
                    setEndTimeline(true);
                }
                setPostsToDisplay(componentsArray);
                setPostsFetched(true);
            } catch (err) {
                console.log(err);
            }
        };
        if (newPost) {
            setNewPost(false);
            fetchTimeline();
        }
        if (!postsFetched) {
            if (fetchedMore) {
                setFetchCounter(fetchCounter + 1);
            }
            fetchTimeline();
        }
    }, [postsFetched, newPost]);

    const newPostCreated = function () {
        setNewPost(true);
    };

    useEffect(() => {
        const handleScroll = function () {
            setFetchedMore((fetchedMore) => {
                if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 0.1 * document.body.offsetHeight
                ) {
                    setPostsFetched(false);
                    return true;
                }
                return false;
            });
        };
        if (!endTimeline) {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    // header, notificacoes e logout
    if (token === "") {
        return (
            <div>
                <h1>Homepage</h1>
                <Link to="/login">Login</Link>
            </div>
        );
    } else if (!postsFetched && fetchCounter === 0) {
        return (
            <div>
                <p>fetching</p>
            </div>
        );
    } else {
        return (
            <div className="my-8 w-2/3 mx-auto">
                <WhatsOnYourMind apiurl={apiUrl} newpost={newPostCreated} userprofile={false} />
                {postsToDisplay.length > 0 ? <ul>{postsToDisplay}</ul> : <p>No posts to display</p>}
            </div>
        );
    }
};

export default Homepage;
