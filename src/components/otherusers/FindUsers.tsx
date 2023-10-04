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
    const [fetchMore, setFetchMore] = useState(0);

    useEffect(() => {
        const fetchUsers = async function () {
            const response = await fetch(apiUrl + facebookid + "/users/" + fetchMore, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            const componentsArray = [...usersThumbnailComponents];
            console.log("before");
            console.log(componentsArray);
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
            console.log("after");
            console.log(componentsArray);
            setUsersThumbnailComponents(componentsArray);
        };
        if (!usersFetched) {
            fetchUsers();
            setUsersFetched(true);
        }
    }, [fetchMore]);

    const handleClick = function (event: React.MouseEvent) {
        setFetchMore(fetchMore + 1);
        setUsersFetched(false);
    };
    if (usersFetched) {
        return (
            <div className="w-2/3 mx-auto">
                <h2 className="text-xl">Odinbook users</h2>
                {usersThumbnailComponents !== undefined && usersThumbnailComponents.length > 0 ? (
                    <div>
                        <ul>{usersThumbnailComponents}</ul>
                        <button onClick={handleClick}>More</button>
                    </div>
                ) : (
                    <p>You are friends with everyone on Odinbook.</p>
                )}
            </div>
        );
    } else if (!usersFetched && fetchMore === 0) {
        return <p>fetching</p>;
    }
};

export default FindUsers;

// react-scroll
