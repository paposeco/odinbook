import React, {useState, useEffect} from "react";
import {useParams} from "react-router";
import type {Author} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";
import Fetching from "components/Fetching";

interface FuncProps {
    apiurl: string;
    updaterequestsent(): void;
}

const FriendsFriendsList: React.FC<FuncProps> = (props) => {
    const [friendsList, setFriendsList] = useState<Author[]>();
    const [friendsFetched, setFriendsFetched] = useState(false);
    const [friendsThumbnailComponents, setFriendsThumbnailComponents] = useState<JSX.Element[]>();
    const apiUrl = props.apiurl;
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const {userfacebookid} = useParams();

    useEffect(() => {
        const fetchFriendsList = async function () {
            try {
                const response = await fetch(
                    apiUrl + facebookid + "/otheruserprofile/" + userfacebookid + "/friends",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
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

    if (!friendsFetched) {
        return <Fetching />;
    } else {
        return (
            <div className="lg:w-2/3 sm:px-6 lg:px-0 mx-auto mt-8">
                <h2 className="text-2xl mb-2">Friends</h2>
                <ul className="flex flex-row flex-wrap justify-between">
                    {friendsThumbnailComponents}
                </ul>
            </div>
        );
    }
};

export default FriendsFriendsList;
