import React, {useState, useEffect} from "react";
import type {Author} from "src/common/types";
import FriendThumbnail from "components/friends/FriendThumbnail";

interface FuncProps {
    apiurl: string;
}

const FriendsList: React.FC<FuncProps> = (props) => {
    const [friendsList, setFriendsList] = useState<Author[]>();
    const [friendsFetched, setFriendsFetched] = useState(false);
    const [friendsThumbnailComponents, setFriendsThumbnailComponents] = useState<JSX.Element[]>();
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
                        <FriendThumbnail friend={afriend} key={afriend._id} apiurl={apiUrl} />
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

    return (
        <div className="w-2/3 mx-auto">
            <h2 className="text-xl">Friends</h2>
            <ul>{friendsThumbnailComponents}</ul>
        </div>
    );
};

export default FriendsList;
