import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import type {Author} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Fetching from "components/Fetching";

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
            <div className="lg:w-2/3 sm:px-6 lg:px-0 mx-auto mt-8">
                <h2 className="text-2xl mb-2">Friends</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                        <FontAwesomeIcon icon={faUserPlus} className="w-5" />
                        <Link to="/friendrequestssent">Friend Requests Sent</Link>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5" />
                        <Link to="/findusers">Find more users</Link>
                    </div>
                </div>

                {friendsThumbnailComponents.length > 0 ? (
                    <ul className="flex flex-row flex-wrap justify-between">
                        {friendsThumbnailComponents}
                    </ul>
                ) : (
                    <p>You don't have any friends yet.</p>
                )}
            </div>
        );
    } else {
        return <Fetching />;
    }
};

export default FriendsList;
