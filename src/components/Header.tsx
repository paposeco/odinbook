import React, {useState} from "react";
import {Link} from "react-router-dom";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface FuncProps {
    apiurl: string;
    profilepic: string;
    notifications: number;
}

const Header: React.FC<FuncProps> = (props) => {
    const [clickedProfile, setClickedProfile] = useState(false);
    const [clickedNotifications, setClickedNotifications] = useState(false);

    const handleClick: React.MouseEventHandler = function (event) {
        if (clickedProfile) {
            setClickedProfile(false);
        } else {
            setClickedProfile(true);
            const hideMenu = function () {
                setClickedProfile(false);
            };
            const timeout = setTimeout(hideMenu, 4000);
            return () => clearInterval(timeout);
        }
    };

    const handleClickNotifications: React.MouseEventHandler = function (event) {
        setClickedNotifications(true);
    };

    if (props.apiurl === "" && props.profilepic === "") {
        return (
            <div className="mb-4 w-full mx-auto">
                <div className="flex flex-row justify-between bg-white px-4 pt-4 pb-4 shadow">
                    <Link to="/" className="text-5xl text-facebookblue">
                        <FontAwesomeIcon icon={faFacebook} />
                    </Link>
                    <div className="flex flex-row gap-4"></div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="mb-4 w-full mx-auto">
                <div className="flex flex-row justify-between bg-white px-4 pt-4 pb-4 shadow">
                    <Link to="/" className="text-5xl text-facebookblue">
                        <FontAwesomeIcon icon={faFacebook} />
                    </Link>
                    <div className="flex flex-row gap-4">
                        <div
                            className="w-12 h-12 bg-slate-200 rounded-full flex content-center justify-center items-center"
                            onClick={handleClickNotifications}
                        >
                            <Link to="/friendrequests" className="no-underline relative">
                                <FontAwesomeIcon
                                    icon={faBell}
                                    className="text-3xl text-facebookblue "
                                />
                                {props.notifications > 0 && !clickedNotifications ? (
                                    <p className="absolute rounded-full bg-red-500 text-white text-xs left-7 -top-1.5 px-2 py-1">
                                        {props.notifications}
                                    </p>
                                ) : null}{" "}
                            </Link>
                        </div>
                        <button className="relative text-slate-800" onClick={handleClick}>
                            <img
                                src={props.apiurl + props.profilepic}
                                alt="profile pic"
                                className="w-12 h-12 rounded-full object-cover aspect-square"
                            />
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="absolute rounded-full top-8 left-8 bg-slate-100 border-white border p-px text-xs"
                            />
                        </button>
                        {clickedProfile ? (
                            <div className="absolute right-4 top-20 " onClick={handleClick}>
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
            </div>
        );
    }
};

export default Header;
