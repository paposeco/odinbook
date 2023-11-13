import React, {useState} from "react";
import {Link} from "react-router-dom";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FuncProps {
    apiurl: string;
    profilepic: string;
    notifications: number;
}

const Header: React.FC<FuncProps> = (props) => {
    const display_name = localStorage.getItem("displayname");
    // const notifications = Number(props.notifications);
    const notifications = 3;
    const [clickedProfile, setClickedProfile] = useState(false);

    const handleClick: React.MouseEventHandler = function (event) {
        if (clickedProfile) {
            setClickedProfile(false);
        } else {
            setClickedProfile(true);
        }
    };

    return (
        <div className="mb-4 w-full mx-auto">
            <div className="flex flex-row justify-between bg-white px-4 pt-4 pb-4 shadow">
                <Link to="/" className="text-5xl text-facebookblue">
                    <FontAwesomeIcon icon={faFacebook} />
                </Link>
                <div className="flex flex-row gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex content-center justify-center items-center">
                        <Link to="/friendrequests" className="no-underline relative">
                            <FontAwesomeIcon
                                icon={faBell}
                                className="text-3xl text-facebookblue "
                            />
                            {notifications > 0 ? (
                                <p className="absolute rounded-full bg-red-500 text-white text-xs left-7 -top-1.5 px-2 py-1">
                                    {notifications}
                                </p>
                            ) : null}{" "}
                        </Link>
                    </div>
                    <button className="relative text-slate-800" onClick={handleClick}>
                        <img
                            src={props.apiurl + props.profilepic}
                            alt="profile pic"
                            className="w-12 h-12 rounded-full"
                        />
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className="absolute rounded-full top-8 left-8 bg-slate-100 border-white border p-px text-xs"
                        />
                    </button>
                    {clickedProfile ? (
                        <div className="absolute right-4 top-20 ">
                            <Link to="/profile" className="no-underline">
                                <p className="text-lg py-4 px-8 my-1 text-slate-800 bg-white shadow rounded-lg hover:bg-facebookblue hover:text-white">
                                    Profile
                                </p>
                            </Link>

                            <Link to="/logout" className="no-underline">
                                <p className="text-lg my-1 py-4 px-8 text-slate-800 bg-white shadow rounded-lg hover:bg-facebookblue hover:text-white">
                                    Logout
                                </p>
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-2 px-4">
                <Link
                    to="/profile"
                    className="flex flex-row gap-1 items-center no-underline text-slate-800"
                >
                    <img
                        src={props.apiurl + props.profilepic}
                        alt="profile pic"
                        className="w-10 h-10 rounded-full ml-1"
                    />
                    <p className="text-lg">{display_name}</p>
                </Link>

                <Link
                    to="/friends"
                    className="no-underline text-slate-800 flex flex-row gap-1 w-fit items-center"
                >
                    <FontAwesomeIcon
                        icon={faUserGroup}
                        className="text-2xl w-10 text-facebookblue ml-1"
                    />
                    <p className="text-lg">Friends</p>
                </Link>
            </div>
        </div>
    );
};

export default Header;
