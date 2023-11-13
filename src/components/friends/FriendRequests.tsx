import React, {useEffect, useState} from "react";
import type {Friend} from "src/common/types";
import FriendThumbnail from "./FriendThumbnail";
import Birthdays from "./Birthdays";
import {DateTime} from "luxon";

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

    return (
        <div className="w-2/3 mx-auto">
            {birthdaysToday.length === 0 && nearBirthdays.length === 0 ? (
                <h3>No birthdays in the near future</h3>
            ) : null}
            {birthdaysToday.length > 0 ? (
                <h3>
                    Today ({month} {day}), say happy birthday to:
                </h3>
            ) : null}
            {birthdaysToday.length > 0 ? <ul>{birthdaysToday}</ul> : null}
            {nearBirthdays.length > 0 ? <h2>Birthdays in the near future:</h2> : null}
            {nearBirthdays.length > 0 ? <ul>{nearBirthdays}</ul> : null}
            <h2 className="text-xl">Friend requests received</h2>
            {props.requests.length > 0 ? (
                <ul>{userThumbnailComponents}</ul>
            ) : (
                <p>No new friend requests received.</p>
            )}
        </div>
    );
};

export default FriendRequests;
