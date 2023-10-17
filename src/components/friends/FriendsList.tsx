import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Author} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";

interface FuncProps {
    apiurl: string;
    updaterequestsent(): void;
}

const FriendsList: React.FC<FuncProps> = (props) => {
    const [friendsList, setFriendsList] = useState<Author[]>();
    const [friendsFetched, setFriendsFetched] = useState(false);
    const [friendsThumbnailComponents, setFriendsThumbnailComponents] = useState<JSX.Element[]>([]);
    const apiUrl = props.apiurl;
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFriendsList = async function () {
            try {
                const response = await fetch(apiUrl + facebookid + "/friends", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                const responseData = await response.json();
                setFriendsList(responseData.friends);
                const componentsArray = [];
                responseData.friends.map((afriend) => {
                    componentsArray.push(
                        <FriendThumbnail
                            friend={afriend}
                            key={afriend._id}
                            apiurl={apiUrl}
                            requestreceived={false}
                            sendrequest={false}
                            requestsent={false}
                            updaterequestsent={props.updaterequestsent}
                        />
                    );
                });
                setFriendsThumbnailComponents(componentsArray);
            } catch (err) {
                console.log(err);
            }
        };
        if (!friendsFetched) {
            setFriendsFetched(true);
            fetchFriendsList();
        }
    }, []);

    if (friendsFetched) {
        return (
            <div className="w-3/4 mx-auto">
                <h2 className="text-xl">Friends</h2>
                <Link to="/friendrequestssent">Friend Requests Sent</Link>
                <Link to="/findusers">Find more users</Link>
                {friendsThumbnailComponents.length > 0 ? (
                    <ul>{friendsThumbnailComponents}</ul>
                ) : (
                    <p>You don't have any friends yet</p>
                )}
            </div>
        );
    } else {
        return <p>fetching</p>;
    }
};

export default FriendsList;
