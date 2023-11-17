import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import FriendThumbnail from "components/friends/FriendThumbnail";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {faUsersViewfinder} from "@fortawesome/free-solid-svg-icons";
import Fetching from "components/Fetching";

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
    const [displayUsers, setDisplayUsers] = useState(true);
    const [searchResults, setSearchResults] = useState<JSX.Element[]>([]);
    const [displaySearchResults, setDisplaySearchResults] = useState(false);
    const [fetchedMore, setFetchedMore] = useState(false);
    const [endTimeline, setEndTimeline] = useState(false);
    const [fetchCounter, setFetchCounter] = useState(0);
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
            if (responseData.usersthatmatch.length > 0) {
                const users = responseData.usersthatmatch;
                const currentUser = responseData.currentUser;
                const componentsArray = [];
                users.map((user) => {
                    const requestexists = currentUser.requests_sent.find(
                        (element) => element.facebook_id === user.facebook_id
                    );
                    const isFriend = currentUser.friends.includes(user._id);

                    let requestsent = false;
                    if (requestexists !== undefined) {
                        requestsent = true;
                    }
                    componentsArray.push(
                        <FriendThumbnail
                            friend={user}
                            key={user._id}
                            apiurl={apiUrl}
                            requestreceived={false}
                            sendrequest={!isFriend}
                            requestsent={requestsent}
                            updaterequestsent={props.updaterequestsent}
                        />
                    );
                });

                setDisplaySearchResults(true);
                setDisplayUsers(false);
                setSearchResults(componentsArray);
            } else {
                setDisplaySearchResults(true);
                setDisplayUsers(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = function (event: React.FormEvent<HTMLInputElement>) {
        setsearchcontent(event.currentTarget.value);
    };

    if (usersFetched) {
        return (
            <div className="lg:w-2/3 px-6 lg:px-0 mx-auto mt-8">
                <h2 className="text-2xl mb-2">Browse Odinbook Users</h2>
                <div className="flex flex-row gap-8">
                    <form
                        action=""
                        method=""
                        onSubmit={handleSubmit}
                        className="flex flex-row gap-2 items-center"
                    >
                        <input
                            type="search"
                            name="searchuser"
                            id="searchuser"
                            minLength={2}
                            onChange={handleChange}
                            placeholder="Search user by name"
                            className="rounded-full"
                        />
                        <div className="cursor-pointer">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 pr-2" />
                            <input type="submit" value="Search" className="cursor-pointer" />
                        </div>
                    </form>
                    <div className="flex flex-row gap-2 items-center text-lg">
                        <FontAwesomeIcon icon={faUsersViewfinder} className="w-5" />
                        <Link to="/usersnearyou">Browse users near you</Link>
                    </div>
                </div>
                {displayUsers &&
                usersThumbnailComponents !== undefined &&
                usersThumbnailComponents.length > 0 ? (
                    <div>
                        <ul className="flex flex-row flex-wrap">{usersThumbnailComponents}</ul>
                    </div>
                ) : displayUsers && !displaySearchResults ? (
                    <p>You are friends with everyone in Odinbook.</p>
                ) : null}
                {displaySearchResults ? (
                    <div>
                        <ul className="flex flex-row flex-wrap">{searchResults}</ul>
                    </div>
                ) : null}
                {displaySearchResults && searchResults.length === 0 ? (
                    <p>Couldn't find any users with that name.</p>
                ) : null}
            </div>
        );
    } else if (!usersFetched && fetchCounter === 0) {
        return <Fetching />;
    }
};

export default FindUsers;
