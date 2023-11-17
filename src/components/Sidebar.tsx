import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";

interface FuncProps {
    apiurl: string;
    profilepic: string;
}

const Sidebar: React.FC<FuncProps> = function (props) {
    const display_name = localStorage.getItem("displayname");
    return (
        <div className="lg:flex lg:flex-col lg:gap-2 lg:mt-2 px-4 lg:w-2/12 lg:visible invisible w-0">
            <Link
                to="/profile"
                className="flex flex-row gap-1 items-center no-underline text-slate-800"
            >
                <img
                    src={props.apiurl + props.profilepic}
                    alt="profile pic"
                    className="w-10 h-10 rounded-full object-cover aspect-square"
                />
                <p className="lg:text-lg">{display_name}</p>
            </Link>

            <Link
                to="/friends"
                className="no-underline text-slate-800 flex flex-row gap-1 w-fit items-center"
            >
                <FontAwesomeIcon icon={faUserGroup} className="text-2xl w-10 text-facebookblue" />
                <p className="lg:text-lg">Friends</p>
            </Link>
        </div>
    );
};

export default Sidebar;
