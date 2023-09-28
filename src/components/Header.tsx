import React, {useState} from "react";
import {Link} from "react-router-dom";

interface FuncProps {
    apiurl: string;
    profilepic: string;
}

const Header: React.FC<FuncProps> = (props) => {
    const display_name = localStorage.getItem("displayname");

    return (
        <div className="flex flex-row gap-4 my-8 w-2/3 mx-auto justify-between p-8">
            <div>
                <Link to="/">
                    <h3>Odinbook</h3>
                </Link>
                <div className="flex flex-row gap-2">
                    <img
                        src={props.apiurl + props.profilepic}
                        alt="profile pic"
                        className="w-8 h-8 rounded-full"
                    />
                    <p className="text-xl">{display_name}</p>
                </div>
                <Link to="/friends">
                    <h3>Friends</h3>
                </Link>
                <Link to="/profile">
                    <h3>Profile</h3>
                </Link>
            </div>
            <div className="flex flex-row gap-4">
                <img
                    src={props.apiurl + props.profilepic}
                    alt="profile pic"
                    className="w-24 h-24 rounded-full"
                />
            </div>
        </div>
    );
};

export default Header;
