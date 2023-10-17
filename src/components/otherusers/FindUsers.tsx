import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import type {Friend} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";
interface FuncProps {
    apiurl: string;
    updaterequestsent(): void;
}

const FindUsers: React.FC<FuncProps> = function (props) {
    const apiUrl = props.apiurl;
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [usersFetched, setUsersFetched] = useState(false);
    const [usersThumbnailComponents, setUsersThumbnailComponents] = useState<JSX.Element[]>([]);
    const [fetchedMore, setFetchedMore] = useState(false);
    const [endTimeline, setEndTimeline] = useState(false);
    const [fetchCounter, setFetchCounter] = useState(0);
    const [showbox, setshowbox] = useState(false);
    const [searchcontent, setsearchcontent] = useState("");

    useEffect(() => {
        const fetchUsers = async function () {
            try {
                const response = await fetch(apiUrl + facebookid + "/users/" + fetchCounter, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                const componentsArray = [...usersThumbnailComponents];
                responseData.allUsersNotFriends.map((afriend) => {
                    const requestexists = responseData.currentUser.requests_sent.find(
                        (element) => element.facebook_id === afriend.facebook_id
                    );
                    let requestsent = false;
                    if (requestexists !== undefined) {
                        requestsent = true;
                    }
                    componentsArray.push(
                        <FriendThumbnail
                            friend={afriend}
                            key={afriend._id}
                            apiurl={apiUrl}
                            requestreceived={false}
                            sendrequest={true}
                            requestsent={requestsent}
                            updaterequestsent={props.updaterequestsent}
                        />
                    );
                });
                if (fetchCounter === 0) {
                    setFetchCounter(1);
                }
                if (responseData.allUsersNotFriends.length < 10) {
                    setEndTimeline(true);
                }
                setUsersThumbnailComponents(componentsArray);
                setUsersFetched(true);
            } catch (err) {
                console.log(err);
            }
        };

        if (!usersFetched) {
            if (fetchedMore) {
                setFetchCounter(fetchCounter + 1);
            }
            fetchUsers();
        }
    }, [usersFetched]);

    //untested here, only on timeline
    useEffect(() => {
        const handleScroll = function () {
            setFetchedMore((fetchedMore) => {
                if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 0.1 * document.body.offsetHeight
                ) {
                    setUsersFetched(false);
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

    const showsearchbox = function (event: React.MouseEvent) {
        setshowbox(true);
    };

    //handle both errors and results
    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch(apiUrl + facebookid + "/searchuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({searchkeyword: searchcontent})
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function (event: React.FormEvent<HTMLInputElement>) {
        setsearchcontent(event.currentTarget.value);
    };

    if (usersFetched) {
        return (
            <div className="w-3/4 mx-auto">
                <h2 className="text-xl">Odinbook users</h2>
                <div>
                    <Link to="/usersnearyou">Find users near you</Link>
                    <button onClick={showsearchbox}>Search user by name</button>
                    {showbox ? (
                        <form action="" method="" onSubmit={handleSubmit}>
                            <input
                                type="search"
                                name="searchuser"
                                id="searchuser"
                                onChange={handleChange}
                            />
                            <input type="submit" value="Search" />
                        </form>
                    ) : null}
                </div>
                {usersThumbnailComponents !== undefined && usersThumbnailComponents.length > 0 ? (
                    <div>
                        <ul className="flex flex-row">{usersThumbnailComponents}</ul>
                    </div>
                ) : (
                    <p>You are friends with everyone in Odinbook.</p>
                )}
            </div>
        );
    } else if (!usersFetched && fetchCounter === 0) {
        return <p>fetching</p>;
    }
};

export default FindUsers;
