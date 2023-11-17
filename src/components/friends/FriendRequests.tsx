import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "./FriendThumbnail";
import Birthdays from "./Birthdays";
import {DateTime} from "luxon";
import {faBirthdayCake} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays} from "@fortawesome/free-regular-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import Fetching from "components/Fetching";

interface FuncProps {
    requests: Friend[];
    apiurl: string;
    updaterequestsent(): void;
}

const FriendRequests: React.FC<FuncProps> = function (props) {
    const [userThumbnailComponents, setUserThumbnailComponents] = useState<JSX.Element[]>();
    const facebookid = localStorage.getItem("facebookid");
    const token = localStorage.getItem("token");
    const [birthdaysFetched, setBirthdaysFetched] = useState(false);
    const [birthdaysToday, setBirthdaysToday] = useState<JSX.Element[]>([]);
    const [nearBirthdays, setNearBirthdays] = useState<JSX.Element[]>([]);
    const now = DateTime.now();
    const month = now.monthLong;
    const day = now.day;

    useEffect(() => {
        const componentsArray = [];
        props.requests.map((auser) => {
            componentsArray.push(
                <FriendThumbnail
                    friend={auser}
                    key={auser.facebook_id}
                    apiurl={props.apiurl}
                    requestreceived={true}
                    sendrequest={false}
                    requestsent={false}
                    updaterequestsent={props.updaterequestsent}
                />
            );
        });
        setUserThumbnailComponents(componentsArray);
    }, []);

    useEffect(() => {
        const fetchBirthdays = async function () {
            const response = await fetch(props.apiurl + facebookid + "/birthdays", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            if (responseData.friendsbirthdays.length > 0) {
                const birthstodayarray = [];
                responseData.friendsbirthdays.map((friend) => {
                    const friendData = {
                        displayname: friend.display_name,
                        facebookid: friend.facebook_id,
                        profilepic: friend.profile_pic,
                        birthday: friend.birthday
                    };
                    birthstodayarray.push(
                        <Birthdays apirul={props.apiurl} friendinfo={friendData} future={false} />
                    );
                });
                setBirthdaysToday(birthstodayarray);
            }
            if (responseData.futurebirthdays.length > 0) {
                const futurebirthsarray = [];
                responseData.futurebirthdays.map((friend) => {
                    const friendData = {
                        displayname: friend.display_name,
                        facebookid: friend.facebook_id,
                        profilepic: friend.profile_pic,
                        birthday: friend.birthday
                    };
                    futurebirthsarray.push(
                        <Birthdays apirul={props.apiurl} friendinfo={friendData} future={true} />
                    );
                });
                setNearBirthdays(futurebirthsarray);
            }
        };
        if (!birthdaysFetched) {
            setBirthdaysFetched(true);
            fetchBirthdays();
        }
    }, []);

    if (!birthdaysFetched) {
        return <Fetching />;
    } else {
        return (
            <div className="lg:w-2/3 w-full sm:px-4 lg:px-0 mx-auto lg:grid lg:grid-cols-2 mt-8">
                <div className="mb-4">
                    <div className="flex flex-row gap-2 items-center">
                        <FontAwesomeIcon icon={faBirthdayCake} className="text-xl sm:text-2xl" />
                        <h2 className="text-xl sm:text-2xl">Birthdays today</h2>
                    </div>

                    {birthdaysToday.length === 0 ? (
                        <p className="my-2">No birthdays today.</p>
                    ) : null}
                    {birthdaysToday.length > 0 ? (
                        <div className="my-4">
                            <p className="text-xl">
                                {month} {day}
                            </p>
                            <ul>{birthdaysToday}</ul>
                        </div>
                    ) : null}

                    {nearBirthdays.length > 0 ? (
                        <div className="flex flex-row gap-2 items-center mt-8">
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                className="text-xl sm:text-2xl"
                            />
                            <h2 className="text-xl sm:text-2xl">Birthdays in the near future:</h2>
                        </div>
                    ) : null}
                    {nearBirthdays.length > 0 ? <ul>{nearBirthdays}</ul> : null}
                </div>
                <div className="mt-8 lg:mt-0">
                    <div className="flex flex-row gap-2 items-center">
                        <FontAwesomeIcon icon={faUserGroup} className="text-xl sm:text-2xl" />
                        <h2 className="text-xl sm:text-2xl">Friend requests received</h2>
                    </div>

                    {props.requests.length > 0 ? (
                        <ul className="flex flex-row flex-wrap content-center">
                            {userThumbnailComponents}
                        </ul>
                    ) : (
                        <p className="my-2">No new friend requests received.</p>
                    )}
                </div>
            </div>
        );
    }
};

export default FriendRequests;
