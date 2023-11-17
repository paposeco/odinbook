import React from "react";
import {Link, useNavigate} from "react-router-dom";

interface FuncProps {
    userloggedout(): void;
}

const Logout: React.FC<FuncProps> = function (props) {
    const navigate = useNavigate();
    const handleClick = function (event: React.MouseEvent) {
        localStorage.clear();
        navigate("/");
        props.userloggedout();
    };

    return (
        <div className="sm:w-2/3 mx-auto mt-8">
            <h2 className="text-2xl">Logout</h2>
            Are you sure you want to logout?
            <div className="flex flex-row gap-2">
                <button
                    onClick={handleClick}
                    className="bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg cursor-pointer hover:font-bold "
                >
                    Yes
                </button>
                <Link
                    to="/"
                    className="bg-facebookblue shadow py-2 px-6 my-2 text-white rounded-lg cursor-pointer hover:font-bold no-underline"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default Logout;
