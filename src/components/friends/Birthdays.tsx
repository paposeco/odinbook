import React from "react";
import {Link} from "react-router-dom";
import {DateTime} from "luxon";

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
    return (
        <div>
            {props.future ? (
                <p>
                    {birthDay} {birthMonth}
                </p>
            ) : null}
            <img src={props.apirul + props.friendinfo.profilepic} alt="profilepic" />
            <Link to={`/user/${props.friendinfo.facebookid}/`}>{props.friendinfo.displayname}</Link>
        </div>
    );
};

export default Birthdays;
