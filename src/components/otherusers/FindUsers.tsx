import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";
interface FuncProps {
    apiurl: string;
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

    useEffect(() => {
        const fetchUsers = async function () {
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
                    />
                );
            });
            if (fetchCounter === 0) {
                setFetchCounter(1);
            }
            if (responseData.allUsersNotFriends.length < 2) {
                setEndTimeline(true);
            }
            setUsersThumbnailComponents(componentsArray);
            setUsersFetched(true);
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

    if (usersFetched) {
        return (
            <div className="w-2/3 mx-auto">
                <h2 className="text-xl">Odinbook users</h2>
                {usersThumbnailComponents !== undefined && usersThumbnailComponents.length > 0 ? (
                    <div>
                        <ul>{usersThumbnailComponents}</ul>
                    </div>
                ) : (
                    <p>You are friends with everyone on Odinbook.</p>
                )}
            </div>
        );
    } else if (!usersFetched && fetchCounter === 0) {
        return <p>fetching</p>;
    }
};

export default FindUsers;
