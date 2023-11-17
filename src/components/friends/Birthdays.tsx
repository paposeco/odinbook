import React from "react";
import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {faBirthdayCake} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FriendInfo {
    displayname: string;
    facebookid: string;
    profilepic: string;
    birthday: string;
}

interface FuncProps {
    friendinfo: FriendInfo;
    apirul: string;
    future: boolean;
}

const Birthdays: React.FC<FuncProps> = function (props) {
    const now = DateTime.now();
    const day = now.day;
    const friendbirthday = new Date(props.friendinfo.birthday);
    const birthDay = friendbirthday.getDate();
    const birthMonth = DateTime.fromJSDate(friendbirthday).monthLong;
    const birthYear = DateTime.fromJSDate(friendbirthday).year;
    const age = Number(now.year) - Number(birthYear);

    return (
        <div className="my-4">
            {props.future ? (
                <div className="my-4">
                    <p className="text-xl">
                        {birthDay} {birthMonth}
                    </p>
                </div>
            ) : null}

            <div className="flex flex-row items-center ml-6 lg:ml-6">
                <Link to={`/user/${props.friendinfo.facebookid}/`}>
                    <img
                        src={props.apirul + props.friendinfo.profilepic}
                        alt="profilepic"
                        className="lg:w-56 lg:h-56 sm:w-36 sm:h-36 w-20 h-20 rounded-full aspect-square object-cover mr-4"
                    />
                </Link>

                <div className="flex flex-col">
                    <Link
                        to={`/user/${props.friendinfo.facebookid}/`}
                        className="text-lg text-slate-800"
                    >
                        {props.friendinfo.displayname}
                    </Link>
                    <span className="text-lg text-slate-800">{age} years old</span>
                </div>
            </div>
        </div>
    );
};

export default Birthdays;
