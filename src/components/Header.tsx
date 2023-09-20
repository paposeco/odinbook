import React from "react";

interface FuncProps {
    apiurl: string;
}

const Header: React.FC<FuncProps> = (props) => {
    const profilepic = localStorage.getItem("profilepic");
    const display_name = localStorage.getItem("displayname");

    return (
        <div className="flex flex-row gap-4">
            <div>
                <p>Friends</p>
                <p>Profile</p>
            </div>
            <div className="flex flex-row gap-4">
                <p className="text-3xl">Hello {display_name}</p>
                <img src={props.apiurl + profilepic} alt="profile pic" className="w-24" />
            </div>
        </div>
    );
};

export default Header;
