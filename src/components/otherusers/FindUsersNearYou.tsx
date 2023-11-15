import React, {useEffect, useState} from "react";
import FriendThumbnail from "components/friends/FriendThumbnail";
import {getCountryName} from "components/userprofile/CountrySelector";
import Fetching from "components/Fetching";

interface FuncProps {
    apiurl: string;
    updaterequestsent(): void;
    currusercountry: string;
}

const FindUsers: React.FC<FuncProps> = function (props) {
    const apiUrl = props.apiurl;
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [usersFetched, setUsersFetched] = useState(false);
    const [usersThumbnailComponents, setUsersThumbnailComponents] = useState<JSX.Element[]>([]);
    const countryname = getCountryName(props.currusercountry);

    useEffect(() => {
        const fetchUsers = async function () {
            try {
                const response = await fetch(
                    apiUrl + facebookid + "/usersnear/" + props.currusercountry,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
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
                setUsersThumbnailComponents(componentsArray);
                setUsersFetched(true);
            } catch (err) {
                console.log(err);
            }
        };

        if (!usersFetched) {
            fetchUsers();
        }
    }, [usersFetched]);

    if (usersFetched) {
        return (
            <div className="w-2/3 mx-auto">
                <h2 className="text-2xl">Odinbook users in {countryname}</h2>
                {usersThumbnailComponents !== undefined && usersThumbnailComponents.length > 0 ? (
                    <div>
                        <ul className="flex flex-row">{usersThumbnailComponents}</ul>
                    </div>
                ) : (
                    <p>You are friends with everyone in Odinbook from your country.</p>
                )}
            </div>
        );
    } else if (!usersFetched) {
        return <Fetching />;
    }
};

export default FindUsers;
